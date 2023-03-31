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
          azureKeyVault([[envVariable: 'BBWCR_KEY', name: 'bbwcr', secretType: 'Secret']])
      }
      steps {
         sh '''
            echo "Push"
            docker login -u bbwcr -p $BBWCR_KEY $ACR
            docker push $ACR/$SERVICE:$TAG
          '''
      }
    }
    stage('CI: Deploy') {
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
