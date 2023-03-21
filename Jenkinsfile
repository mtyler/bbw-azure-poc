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
    stage('Branch Validation: Build & Unit Test') {
      steps {
        sh '''
            echo "Cleanup..."
            rm -rf ./node_modules
            rm -f junit.xml eslint.xml package-lock.json
            echo "Setup..."
            npm install
            ## uncomment to include static code analysis
            ## echo "Running Lint..."
            ## npx eslint -c .eslintrc.yml -f checkstyle app.js > eslint.xml
            echo "Running Tests..."
            npm run test-ci
        '''    
      junit 'junit.xml'
      }
    }
    stage('Branch Validation: Docker Build') {
      steps {
        sh '''
            echo "Docker Build"
            docker build --progress=plain --no-cache -t $ACR/$SERVICE:$TAG $WORKSPACE/. --build-arg BUILD=$TAG
        '''    
      junit 'junit.xml'
      }
    }
    stage('Branch Validation: Push') {
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
    stage('Branch Validation: Deploy') {
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
    stage('Branch Validation: Smoke Test') {
      steps {
          script {
            echo "Smoke Test Branch"
            RESULT = sh (
                  script: '''
                  echo "give $SERVICE time to get ingress"
                  sleep 25
                  JOB_LOWER=$(echo $JOB_BASE_NAME | tr '[:upper:]' '[:lower:]')
                  curl http://$(kubectl get svc --namespace $JOB_LOWER $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080''',
                  returnStdout: true
              ).trim()
            echo "test result: ${RESULT}"
          }
        }
    }
    stage('Trunk Validation: Deploy QA') {
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy QA"
          az aks get-credentials -g $RGROUP -n $AKS 
          kubectl cluster-info
          helm upgrade $SERVICE $SERVICE/ --install --reuse-values --create-namespace -n qa -f $WORKSPACE/poc/values.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('Trunk Validation: Smoke Test QA') {
      when { 
          branch 'main'
      }
      steps {
        script {
          echo "Smoke Test QA"
          RESULT = sh (
                script: 'curl http://$(kubectl get svc --namespace qa $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080',
                returnStdout: true
            ).trim()
          echo "test result: ${RESULT}"
        }
      }
    }
    stage('Trunk Validation: Deploy Prod') {
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy Prod"
          az aks get-credentials -g $RGROUP -n $AKS 
          kubectl cluster-info
          helm upgrade $SERVICE $SERVICE/ --install --reuse-values --create-namespace -n prod -f $WORKSPACE/poc/values.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('Trunk Validation: Smoke Test Prod') {
      when { 
          branch 'main'
      }
      steps {
        script {
          echo "Smoke Test Prod"
          RESULT = sh (
                script: 'curl http://$(kubectl get svc --namespace prod $SERVICE --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}"):8080',
                returnStdout: true
            ).trim()
          echo "test result: ${RESULT}"
        }
      }
    }
  }
} //pipeline
