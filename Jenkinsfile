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
                    
                    // Navigate to the VGG19 directory and unzip the file
                    bat """
                    cd %WORKSPACE%\\Back\\Model_VGG19
                    if exist vgg19_genre_classifier (rd /s /q vgg19_genre_classifier)
                    mkdir vgg19_genre_classifier
                    tar -xf vgg19_genre_classifier.zip -C vgg19_genre_classifier
                    """
                }
            }
        }
           
        stage('Build Docker Images') {
            steps {
                script {
                    // Build the frontend image
                    bat """
                    docker build %WORKSPACE%\\Front -t frontend-app
                    """
                   
                    // Build the SVM model backend image
                    bat """
                    docker build %WORKSPACE%\\Back\\Model_SVM -t model-svm-backend
                    """
                   
                    // Build the VGG19 model backend image
                    bat """
                    docker build %WORKSPACE%\\Back\\Model_VGG19 -t model-vgg19-backend
                    """
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    echo "Running Docker containers..."
                   
                    // Run the frontend container
                    bat """
                    docker run -d --name frontend-container -p 1000:8080 frontend-app
                    """
                   
                    // Run the SVM model backend container
                    bat """
                    docker run -d --name model-svm-container -p 1001:5000 model-svm-backend
                    """
                   
                    // Run the VGG19 model backend container
                    bat """
                    docker run -d --name model-vgg19-container -p 1002:5000 model-vgg19-backend
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

        stage('Health Check') {
            steps {
                script {
                    // Perform health checks for each service
                    def services = [
                        "http://localhost:1000", // Frontend
                        "http://localhost:1001", // Model SVM
                        "http://localhost:1002"  // Model VGG19
                    ]

                    for (service in services) {
                        bat """
                        curl --fail --silent --show-error ${service} ||
                        echo Service ${service} is not healthy && exit 1
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up resources..."
               
                // Stop each container
                bat """
                docker stop frontend-container || true
                docker stop model-svm-container || true
                docker stop model-vgg19-container || true
                """
               
                // Optionally remove containers
                bat """
                docker rm frontend-container || true
                docker rm model-svm-container || true
                docker rm model-vgg19-container || true
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
