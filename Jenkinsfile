pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/DivyaJeyashree/cognitest-framework.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t cognitest:latest .'
            }
        }

        stage('Run Tests (Web + API only)') {
            steps {
                sh '''
                docker run --rm \
                -v $(pwd)/allure-results:/app/reports/allure-results \
                cognitest:latest npm run test
                '''
            }
        }

        stage('Store Results') {
            steps {
                archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
