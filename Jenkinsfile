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
    stage('Feature Branch Validation') {
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
    stage('Docker Build') {
      steps {
        sh '''
            echo "Docker Build"
            docker build --progress=plain --no-cache -t $ACR/$SERVICE:$TAG $WORKSPACE/.
        '''    
      }
    }
    stage('Push') {
      options {
          azureKeyVault([[envVariable: 'BBWCR_KEY', name: 'bbwcr', secretType: 'Secret']])
      }
      when { 
          branch 'main'
      }    
      steps {
         sh '''
            echo "Push"
            docker login -u bbwcr -p $BBWCR_KEY $ACR
            docker push $ACR/$SERVICE:$TAG
          '''
      }
    }
    stage('Deploy QA') {
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy QA"
          az aks get-credentials -g $RGROUP -n $AKS 
          kubectl cluster-info
          helm upgrade $SERVICE $SERVICE/ --install --create-namespace -n qa -f $WORKSPACE/poc/values.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('Smoke Test QA') {
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
    stage('Deploy Prod') {
      when { 
          branch 'main'
      }
      steps {
        sh '''
          echo "Deploy Prod"
          az aks get-credentials -g $RGROUP -n $AKS 
          kubectl cluster-info
          helm upgrade $SERVICE $SERVICE/ --install --create-namespace -n prod -f $WORKSPACE/poc/values.yaml --set image.tag=$TAG --set image.pullPolicy=Always
        '''
      }
    }
    stage('Smoke Test Prod') {
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
