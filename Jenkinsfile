pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                script {
                    // Example: build Docker images
                    sh 'docker-compose build'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Example: run tests
                    sh 'docker-compose run --rm <service-name> pytest'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Example: deploy or start the service
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            // Cleanup actions if needed
            sh 'docker-compose down'
        }
    }
}
