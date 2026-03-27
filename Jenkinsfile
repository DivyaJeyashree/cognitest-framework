pipeline {
    agent any

    environment {
        IMAGE_NAME = "cognitest"
        CONTAINER_NAME = "cognitest-app"
        APP_PORT = "3000"
    }

    options {
        // Keep only last 10 builds to save space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Fail the build if any step fails
        failFast true
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo "Cloning Git repository..."
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
                if [ \$(docker ps -a -q -f name=${CONTAINER_NAME}) ]; then
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                fi
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
                sh 'sleep 15'  // increase if your app takes longer
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
