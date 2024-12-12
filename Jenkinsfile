pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Checkout your repository into the default Jenkins workspace
                    git branch: 'main', url: 'https://github.com/Youssef-Arouay/MusicClassification_ML_DevOps'
                }
            }
        }

        stage('Unzip VGG19 Model') {
            steps {
                script {
                    echo "Unzipping vgg19_genre_classifier.zip..."

                    // PowerShell command to unzip the file in the same directory
                    bat """
                    powershell -Command "Expand-Archive -Path '%WORKSPACE%\\Back\\Model_VGG19\\vgg19_genre_classifier.zip' -DestinationPath '%WORKSPACE%\\Back\\Model_VGG19'"
                    """
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Docker images with Docker Compose..."

                    // Stop any existing containers before building new ones
                    bat """
                    docker-compose -f "%WORKSPACE%\\docker-compose.yaml" down
                    """
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    echo "Running Docker containers with Docker Compose..."

                    // Run the containers using Docker Compose
                    bat """
                    docker-compose -f "%WORKSPACE%\\docker-compose.yaml" up -d
                    """
                }
            }
        }

        stage('Delay After Running Containers') {
            steps {
                echo "Delaying for 1 hour after running containers..."
                sleep time: 1, unit: 'HOURS'  // Delay for 1 hour
            }
        }

        
    }

    post {
        always {
            script {
                echo "Cleaning up resources..."

                // Stop the containers using Docker Compose
                bat """
                docker-compose -f "%WORKSPACE%\\docker-compose.yml" down
                """
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
