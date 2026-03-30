pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        TAG = "latest"
        CONTAINER = "cognitest-container"
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
                sh """
                docker build -t ${IMAGE_NAME}:${TAG} .
                """
            }
        }

        stage('Run Tests (Skip Mobile)') {
            steps {
                sh """
                docker run --rm \
                -v \$(pwd)/allure-results:/app/reports/allure-results \
                ${IMAGE_NAME}:${TAG} \
                npm run test
                """
            }
        }

        stage('Generate Allure Report') {
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            echo "Pipeline completed"
        }
        success {
            echo "All tests executed successfully"
        }
        failure {
            echo "Pipeline failed"
        }
    }
}
