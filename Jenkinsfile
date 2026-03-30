pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-container"
    }

    stages {

        stage('Clean Workspace') {
            steps { cleanWs() }
        }

        stage('Checkout Code') {
            steps { checkout scm }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t cognitest:${BUILD_NUMBER} .'
            }
        }

        stage('Run Tests in Container') {
            steps {
                sh '''
                docker run --rm \
                --name cognitest-container \
                cognitest:${BUILD_NUMBER} \
                npm run test
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logs cognitest-container || true'
        }
    }
}
