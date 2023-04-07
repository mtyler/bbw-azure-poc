# bbw-azure-poc
This repo demonstrates  

1. An Express.js app that searches the Salesforce demo Apparel API and returns a JSON payload containing the results

1. A Demo Trunk-based CICD Pipeline deploying app through multiple k8s environments

1. An example integration test using Mock data

## Dependencies

This demo was created using the following services. 
- Azure Kubernetes Service - AKS
- Azure Container Registry - ACR
- Azure Function
- Azure Vault
- Jenkins Blue Ocean

For reference, the demo environment has been exported using the Azure CLI tool ```az group export```. This dump is provided in the /infra directory and comes with no garauntees. It may be useable with some additional edits but it should be used with caution. 

## Usage

### Running locally

- git clone this repo
- Create a clean build: ```npm run build```
- Test local build: ```npm run test```
- Run locally with: ```npm run start``` 
  - application can be reached at http://localhost:3000/

### From Jenkins

- Jenkins jobs require manual starting unless configured otherwise
- There is a running environment for each branch
- The Main branch is published to qa and prod namespaces. URLs can be discovered in the Jenkins log  
- Feature Branches create a "short-lived" environment for testing. URLs can be discovered in the Jenkins log.
- "Short-lived" environments are terminated every evening with an external job. 
- note: Pull Requests trigger simultaneous builds creating a race condition that occassionally fails the first PR build

## Demo Highlights

### CICD, Build, Configuration, etc

[CICD Jenkins Declarative Pipeline](/Jenkinsfile)

[Dual-stage Build Dockerfile](/Dockerfile)

[Helm Charts](/poc)

[Prod Environment Configuration](/poc/values-prod.yaml)

[QA Environment Configuration](/poc/values-qa.yaml)

[Secrets Management](/Jenkinsfile#L45)

### Tests

[Unit Tests](/tests/poc-unit.test.js)

[Integration Tests](/tests/ci/poc-ci.test.js)

### Additional Information

[Jenkins Multibranch Pipeline Tutorial](https://www.jenkins.io/doc/tutorials/build-a-multibranch-pipeline-project/)

[Launch Azure ARM template dump](/infra/resource-group-dump.json)

## TODO

- Address race condition when PR is created
