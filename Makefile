# vi: ft=make
preprod_tag := preprod
prod_tag := prod

curr_branch := $(shell git branch --show-current)
curr_version := $(shell cat VERSION)
$(eval next_version=$(shell printf $$(($(curr_version)+1))))

container_name := app-admin
user := $(shell git config --get user.name)

# Prevent master goals to run if not on master
MASTER_GOALS := new-version
ifneq (,$(filter $(MASTER_GOALS),$(MAKECMDGOALS)))
  ifneq ($(curr_branch),master)
    $(error Please checkout a master commit to create a new version)
  endif
endif

# Get given version or default from VERSION file if not specified
ifneq ($(VERSION),)
  version_to_tag := $(VERSION)
else
  version_to_tag := $(curr_version)
endif

.PHONY: new-version preprod prod docker deploy deploy-prod

new-version: # Creates new version on current commit using bumped VERSION
	@printf "\n\e[1mBumping version from $(curr_version) to $(next_version)\e[0m\n\n"
	$(shell echo $(next_version) > VERSION)
	git add VERSION
	git commit -m "[CI SKIP] v$(next_version)"
	@printf "\n\e[1mTagging current commit\e[0m\n\n"
	git tag v$(next_version)
	@printf "\n\e[1mPushing commit and tag\e[0m\n\n"
	git push --atomic origin master v$(next_version)
	@printf "\n✅\e[32m Version v$(next_version) created!\e[39m\n\n"
	$(eval version_to_tag=$(next_version))
	@$(shell curl --silent -X POST -H "Content-Type: application/json" -d '{"text": "$(user) is creating version $(shell cat VERSION) of $(container_name)"}' $$STAGING_SLACK_HOOK > /dev/null)

preprod: # Tags latest version for preprod OR specified version
	@printf "\e[1mStashing changes\e[0m\n\n"
	git stash
	@printf "\n\e[1mDeleting $(preprod_tag) tag\e[0m\n\n"
	git tag -d $(preprod_tag)
	git push -d origin $(preprod_tag)
	@printf "\n\e[1mChecking out version v$(version_to_tag)\e[0m\n\n"
	git checkout v$(version_to_tag)
	@printf "\n\e[1mTagging v$(version_to_tag) as $(preprod_tag)\e[0m\n\n"
	git tag $(preprod_tag)
	@printf "\n\e[1mPushing tag\e[0m\n\n"
	git push origin refs/tags/$(preprod_tag)
	git checkout master
	@printf "\n✅\e[32m All done!\e[39m\n\n"
	@printf "You can follow deployment progress on circleci\n"
	@$(shell curl --silent -X POST -H "Content-Type: application/json" -d '{"text": "$(user) is releasing version $(shell cat VERSION) of $(container_name)"}' $$PREPROD_SLACK_HOOK > /dev/null)

prod: # Tags latest version for prod OR specified version
	@printf "\e[1mStashing changes\e[0m\n\n"
	git stash
	@printf "\n\e[1mDeleting $(prod_tag) tag\e[0m\n\n"
	git tag -d $(prod_tag)
	git push -d origin $(prod_tag)
	@printf "\n\e[1mChecking out version v$(version_to_tag)\e[0m\n\n"
	git checkout v$(version_to_tag)
	@printf "\n\e[1mTagging v$(version_to_tag) as $(prod_tag)\e[0m\n\n"
	git tag $(prod_tag)
	@printf "\n\e[1mPushing tag\e[0m\n\n"
	git push origin refs/tags/$(prod_tag)
	git checkout master
	@printf "\n✅\e[32m All done!\e[39m\n\n"
	@printf "You can follow deployment progress on circleci\n"
	@$(shell curl --silent -X POST -H "Content-Type: application/json" -d '{"text": "$(user) is releasing version $(shell cat VERSION) of $(container_name)"}' $$PROD_SLACK_HOOK > /dev/null)


##########################
#     Pipeline goals     #
##########################

# Validate env variables for gcloud goals
GCLOUD_GOALS := docker deploy deploy-prod
ifneq (,$(filter $(GCLOUD_GOALS),$(MAKECMDGOALS)))
  ifeq ($(GCLOUD_PROJECT_ID),)
    $(error GCLOUD_PROJECT_ID env variable is not defined)
  endif
endif

# Validate env variables for docker goals
DOCKER_GOALS := docker
ifneq (,$(filter $(DOCKER_GOALS),$(MAKECMDGOALS)))
  ifeq ($(GITHUB_TOKEN),)
    $(error GITHUB_TOKEN env variable is not defined)
  endif
endif

IMAGE_NAME := eu.gcr.io/$(GCLOUD_PROJECT_ID)/$(container_name)
tag := $(IMAGE_NAME):$(version_to_tag)
latest_tag := $(IMAGE_NAME):latest

docker: # Builds and tag docker image
	@printf "🐳\e[1m Building docker container:\e[0m\n"
	@printf "  \e[1mName:   $(container_name)\e[0m\n"
	@printf "  \e[1mTag:    $(tag)\e[0m\n"
	@printf "  \e[1mLatest: $(latest_tag)\e[0m\n\n"
	docker build --add-host github-releases.githubusercontent.com:185.199.109.154 \
	  -t $(container_name) \
	  --build-arg GITHUB_TOKEN=$(GITHUB_TOKEN) \
	  --build-arg ssh_key="$$(cat ${ssh_key})" \
	  .
	docker tag $(container_name) "$(tag)"
	docker tag $(container_name) "$(latest_tag)"

deploy: # Pushes existing docker image to target env
	@printf "\e[1m================================================================================\e[0m\n"
	@printf "\e[1m🚀 Deploying $(container_name) to $(GCLOUD_PROJECT_ID)\e[0m\n"
	@printf "\e[1m================================================================================\e[0m\n"
	@printf "\n\e[1mImage: $(tag)\e[0m\n"
	@printf "\n\e[1m⏳ Pushing container to Docker registry...\e[0m\n\n"
	gcloud config set project $(GCLOUD_PROJECT_ID)
	gcloud auth configure-docker --quiet
	docker push $(tag)
	docker push $(latest_tag)
	@printf "\n\e[1m⏳ Updating deployment...\e[0m\n\n"
	kubectl set image deployment/nginx $(container_name)=$(tag)
	@printf "\n✅\e[32m All done!\e[39m\n\n"
	@printf "You can follow deployment progress with: kubectl get deployments -w\n"

# Validate env variables for prod goals
PROD_GOALS := pull-preprod deploy-prod
ifneq (,$(filter $(PROD_GOALS),$(MAKECMDGOALS)))
  ifeq ($(GCLOUD_PROJECT_ID_PREPROD),)
    $(error GCLOUD_PROJECT_ID_PREPROD env variable is not defined)
  else
    preprod_tag := eu.gcr.io/$(GCLOUD_PROJECT_ID_PREPROD)/$(container_name):$(version_to_tag)
  endif
endif

pull-preprod: # Pulls docker image from preprod
	@printf "\e[1m================================================================================\e[0m\n"
	@printf "\e[1m🚀 Pulling $(container_name) from $(GCLOUD_PROJECT_ID_PREPROD)\e[0m\n"
	@printf "\e[1m================================================================================\e[0m\n\n"
	@printf "\n\e[1m⏳ Pulling container from preprod Docker registry...\e[0m\n\n"
	gcloud config set project $(GCLOUD_PROJECT_ID_PREPROD)
	gcloud auth configure-docker --quiet
	docker pull $(preprod_tag)

deploy-prod: # Rename docker image from preprod and pushes to target env
	@printf "\e[1m================================================================================\e[0m\n"
	@printf "\e[1m🚀 Deploying $(container_name) to $(GCLOUD_PROJECT_ID)\e[0m\n"
	@printf "\e[1m================================================================================\e[0m\n\n"
	@printf "\e[1mPreprod image: $(preprod_tag)\e[0m\n"
	@printf "\e[1mProd image: $(tag)\e[0m\n"
	@printf "\n\e[1m⏳ Re-tagging preprod image for prod\e[0m\n\n"
	docker tag $(preprod_tag) $(tag)
	docker tag $(preprod_tag) $(latest_tag)
	@printf "\n\e[1m⏳ Pushing image to prod\e[0m\n\n"
	gcloud config set project $(GCLOUD_PROJECT_ID)
	gcloud auth configure-docker --quiet
	docker push "$(tag)"
	docker push "$(latest_tag)"
	@printf "\n\e[1m⏳ Updating deployment...\e[0m\n\n"
	kubectl set image deployment/nginx $(container_name)=$(tag)
	@printf "\n✅\e[32m All done!\e[39m\n\n"
	@printf "You can follow deployment progress with: kubectl get deployments -w\n"
