pipeline {
  agent any
  environment {
      ACR='bbwcr.azurecr.io'
      RGROUP='BBW-DEV'
      AKS='BBW-AKS-1'
      SERVICE='poc'
      TAG="${JOB_BASE_NAME}-${BUILD_NUMBER}"
  }
  stages {
    
    stage('Validate: Build & Unit Test') {
      /********************************************************************
       * Here we clean up from the last run and do initial validation 
       * Build, Static analysis, Security scans, Unit Test
       ********************************************************************/
      steps {
        sh '''
            echo "Cleanup..."
            rm -rf ./node_modules
            rm -f junit.xml package-lock.json
            echo "Setup..."
            export JEST_JUNIT_OUTPUT_FILE='junit.xml'
            npm install
            echo "Running Static Code Analysis..."
            echo "TODO: Add Static Code Analysis here"
            echo "Running Unit Tests..."
            npm run test-unit 
        '''    
      junit 'junit.xml'
      }
    }
    stage('CI: Docker Build') {
      steps {
        sh '''
            echo "Docker Build"
            docker build --progress=plain --no-cache -t $ACR/$SERVICE:$TAG $WORKSPACE/. --build-arg BUILD=$TAG
        '''    
      }
    }
    stage('CI: Push') {
      options {
        // Note: Sensitive information like keys should never be commited to source control
        // get key from vault   
        azureKeyVault([[envVariable: 'BBWCR_KEY', name: 'bbwcr', secretType: 'Secret']])
      }
      steps {
        // Push container to Azure Container Registry 
        sh '''
          echo "Push"
          docker login -u bbwcr -p $BBWCR_KEY $ACR
          docker push $ACR/$SERVICE:$TAG
        '''
      }
    }
    stage('CI: Deploy') {
      /********************************************************************
       * Helm install | upgrade to Branch
       *  Note: branches create short-lived environments for testing 
       *        IP is logged in Jenkins  
       ********************************************************************/
      steps {
        sh '''
          echo "Deploy Branch"
          JOB_LOWER=$(echo $JOB_BASE_NAME | tr '[:upper:]' '[:lower:]')
          az aks get-credentials -g $RGROUP -n $AKS 
          helm upgrade $SERVICE $SERVICE/ --install --reuse-values --create-namespace -n $JOB_LOWER -f $WORKSPACE/poc/values.yaml --set image.tag=$TAG --set image.pullPolicy=Always
          kubectl rollout status deployment poc -n $JOB_LOWER --timeout 90s
        '''
      }
    }
    stage('CI: Test') {
      /********************************************************************
       * Wait for environment based on branch-name to start
       * Target Branch Url and exec 'npm run test-ci' 
       ********************************************************************/
      steps {
        sh '''
          echo "give $SERVICE time to get ingress"
          sleep 25
          JOB_LOWER=$(echo $JOB_BASE_NAME | tr '[:upper:]' '[:lower:]')
          echo "get /healthz response..."
          curl -s http://$(kubectl get svc --namespace $JOB_LOWER $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080/healthz
          sleep 5
          echo "run integration test..."
          SFDEMO_URL=$(kubectl get svc --namespace $JOB_LOWER $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080/sfdemo npm run test-ci
        '''  
        junit 'junit.xml'
      }
    }
    // ***********************************
    // BEGIN Continuous Deployment phase 
    //       performed on Trunk|main|master 
    // ***********************************
    stage('CD: Deploy QA') {
      /********************************************************************
       * Helm install | upgrade to Production 
       ********************************************************************/
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy QA"
          az aks get-credentials -g $RGROUP -n $AKS 
          helm upgrade $SERVICE $SERVICE/ --install --reuse-values --create-namespace -n qa -f $WORKSPACE/poc/values-qa.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('CD: Integration Test QA') {
      /********************************************************************
       * Target QA Url and exec 'npm run test-ci' 
       ********************************************************************/
      when { 
          branch 'main'
      }
      steps {
        sh '''  
          echo "Get QA Url..."
          JOB_LOWER=$(echo $JOB_BASE_NAME | tr '[:upper:]' '[:lower:]')
          SFDEMO_URL=$(kubectl get svc --namespace $JOB_LOWER $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080/sfdemo npm run test-ci
        '''
        junit 'junit.xml'
      }
    }
    stage('CD: Deploy Prod') {
      /********************************************************************
       * Helm install | upgrade to Production 
       ********************************************************************/
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy Prod"
          az aks get-credentials -g $RGROUP -n $AKS 
          helm upgrade $SERVICE $SERVICE/ --install --reuse-values --create-namespace -n prod -f $WORKSPACE/poc/values-prod.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('CD: Smoke Test Prod') {
      /********************************************************************
       * Check Production Url for a 200
       ********************************************************************/
      when { 
          branch 'main'
      }
      steps {
        script {
          echo "Smoke Test Prod"
          RESULT = sh (
                script: 'curl -s http://$(kubectl get svc --namespace prod $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080',
                returnStdout: true
            ).trim()
          echo "test result: ${RESULT}"
        }
      }
    }
  }
} //pipeline
