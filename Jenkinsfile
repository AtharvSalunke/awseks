pipeline {

    agent any

    environment {

        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '456387077267'

        ECR_REPOSITORY = 'user-service'

        IMAGE_TAG = "${BUILD_NUMBER}"

        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

        EKS_CLUSTER_NAME = 'demo-eks'
    }

    stages {

        stage('Checkout') {

            steps {
                checkout scm
            }
        }

        stage('Terraform Apply') {

            steps {

                bat '''
                C:\\Terraform\\terraform.exe version

                cd terraform

                C:\\Terraform\\terraform.exe init

                C:\\Terraform\\terraform.exe apply -auto-approve
                '''
            }
        }

        stage('Build Docker Image') {

            steps {

                bat '''
                docker build -t %ECR_REPOSITORY%:%IMAGE_TAG% .
                '''
            }
        }

        stage('Login To ECR') {

            steps {

                bat '''
                aws ecr get-login-password --region %AWS_REGION% > password.txt

                type password.txt | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com

                del password.txt
                '''
            }
        }

        stage('Tag Docker Image') {

            steps {

                bat '''
                docker tag %ECR_REPOSITORY%:%IMAGE_TAG% %ECR_URI%:%IMAGE_TAG%
                '''
            }
        }

        stage('Push Docker Image') {

            steps {

                bat '''
                docker push %ECR_URI%:%IMAGE_TAG%
                '''
            }
        }

        stage('Configure EKS Access') {

            steps {

                bat '''
                aws eks update-kubeconfig --region %AWS_REGION% --name %EKS_CLUSTER_NAME%
                '''
            }
        }

        stage('Test Kubernetes Access') {

            steps {

                bat '''
                set KUBECONFIG=C:\\Users\\athar\\.kube\\config

                kubectl get nodes
                '''
            }
        }

        stage('Deploy To EKS Using Helm') {

            steps {

                bat '''
                set KUBECONFIG=C:\\Users\\athar\\.kube\\config

                C:\\Helm\\windows-amd64\\helm.exe upgrade --install user-service deployment\\helm ^
                --set image.repository=%ECR_URI% ^
                --set image.tag=%IMAGE_TAG%
                '''
            }
        }

        stage('Deploy ServiceMonitor') {

             steps {

                bat '''
                set KUBECONFIG=C:\\Users\\athar\\.kube\\config

                if exist monitoring\\servicemonitor.yaml (
                    kubectl apply -f monitoring\\servicemonitor.yaml
                ) else (
                    echo ServiceMonitor file not found. Skipping...
                )
                '''
            }
    }

        stage('Verify Deployment') {

            steps {

                bat '''
                set KUBECONFIG=C:\\Users\\athar\\.kube\\config

                kubectl get nodes

                kubectl get pods

                kubectl get svc

                kubectl get ingress
                '''
            }
        }
    }

    post {

        success {

            echo "Deployment Successful"

            echo "Image: ${ECR_URI}:${IMAGE_TAG}"
        }

        failure {

            echo "Pipeline Failed"
        }

        always {

            bat '''
            docker image prune -f
            '''
        }
    }
}