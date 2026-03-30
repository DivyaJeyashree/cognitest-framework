pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest:latest"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/DivyaJeyashree/cognitest-framework.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Run Tests (Web + API only)') {
            steps {
                sh '''
                mkdir -p allure-results

                docker run --rm \
                  -v $(pwd)/allure-results:/app/reports/allure-results \
                  $IMAGE_NAME \
                  npm run test -- --platform=web,api
                '''
            }
        }

        stage('Store Results') {
            steps {
                archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
        success {
            echo 'Pipeline SUCCESS'
        }
        failure {
            echo 'Pipeline FAILED'
        }
    }
}
