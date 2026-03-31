pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest:latest"
        CONTAINER_NAME = "cognitest-runner"
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
                echo "Running tests..."

                mkdir -p allure-results

                docker run --rm \
                  -e PLATFORM=web,api \
                  -v $(pwd)/allure-results:/app/reports/allure-results \
                  $IMAGE_NAME \
                  npm run test -- --platform=web,api || true
                '''
            }
        }

        stage('Verify Results') {
            steps {
                sh '''
                echo "Checking Allure results..."
                ls -R allure-results || true
                '''
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure([
                    includeProperties: false,
                    results: [[path: 'allure-results']]
                ])
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
