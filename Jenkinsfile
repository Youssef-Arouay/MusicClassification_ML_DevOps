pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    git branch: 'main', url: 'https://github.com/Youssef-Arouay/MusicClassification_ML_DevOps'
                }
            }
        }

        stage('Unzip VGG19 Model') {
            steps {
                script {
                    echo "Unzipping vgg19_genre_classifier.zip..."
                    sh '''
                    cd Back/Model_VGG19
                    mkdir -p vgg19_genre_classifier
                    tar -xf vgg19_genre_classifier.zip -C vgg19_genre_classifier
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh '''
                    docker-compose build
                    '''
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    sh '''
                    docker-compose up -d
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def services = [
                        "http://localhost:1000", // Frontend on port 4200 via Docker
                        "http://localhost:1001", // Model SVM
                        "http://localhost:1002"  // Model VGG19
                    ]

                    for (service in services) {
                        sh '''
                        curl --fail --silent --show-error ${service} || 
                        (echo "Service ${service} is not healthy" && exit 1)
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up resources..."
                sh '''
                docker-compose down || true
                '''
            }
        }

        success {
            echo "Pipeline completed successfully!"
        }

        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}
