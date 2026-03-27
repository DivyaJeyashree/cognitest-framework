pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-app"
        APP_PORT = "3000"
    }

    stages {

        stage('Checkout SCM') {
            // Jenkins will clone the repo automatically if Pipeline script from SCM is used
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Stop Old Container') {
            steps {
                echo "Stopping and removing old container if exists..."
                sh """
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Running Docker container..."
                sh """
                docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Wait for App to Start') {
            steps {
                echo "Waiting for app to become ready..."
                sh 'sleep 10'  // adjust time if your app takes longer to start
            }
        }

        stage('Trigger Cognitest Execution') {
            steps {
                echo "Triggering Cognitest tests..."
                sh """
                curl -X POST http://localhost:${APP_PORT}/execute \
                -H "Content-Type: application/json" \
                -d '{"suite":"smoke","env":"qa","tags":["login"]}'
                """
            }
        }
    }

    post {
        always {
            echo "Printing container logs..."
            sh "docker logs ${CONTAINER_NAME} || true"
        }
        cleanup {
            echo "Cleaning up container..."
            sh """
            docker stop ${CONTAINER_NAME} || true
            docker rm ${CONTAINER_NAME} || true
            """
        }
    }
}
