pipeline {
    environment {
        DOCKER_CREDENTIALS_ID = 'docker_hub'
        DOCKER_REGISTRY = 'pokilee10'
        KUBE_CONFIG_ID = ''
        KUBE_CLUSTER_NAME = 'minikube'
        KUBE_CONTEXT_NAME = 'minikube'
        KUBE_SERVER_URL = 'https://192.168.39.98:8443'
    }

    agent any

    stages {
        stage('Clone Stage') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Groupvslxl-3/Lab2_Jenkins.git'
            }
        }

        stage('Build and Deploy Services') {
            parallel {
                stage('Frontend Service') {
                    stages {
                        stage('Build Frontend') {
                            steps {
                                buildAndPushImage('frontend')
                            }
                        }
                        stage('Deploy Frontend') {
                            steps {
                                deployService('frontend')
                            }
                        }
                    }
                }

                stage('Backend Service') {
                    stages {
                        stage('Build Backend') {
                            steps {
                                buildAndPushImage('backend')
                            }
                        }
                        stage('Deploy Backend') {
                            steps {
                                deployService('backend')
                            }
                        }
                    }
                }

                stage('Admin Service') {
                    stages {
                        stage('Build Admin') {
                            steps {
                                buildAndPushImage('admin')
                            }
                        }
                        stage('Deploy Admin') {
                            steps {
                                deployService('admin')
                            }
                        }
                    }
                }
            }
        }

        stage('Verify Deployments') {
            steps {
                verifyDeployments()
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}

// Helper functions
def buildAndPushImage(String serviceName) {
    script {
        withDockerRegistry(credentialsId: DOCKER_CREDENTIALS_ID, url: 'https://index.docker.io/v1/') {
            dir(serviceName) {
                sh """
                    docker build -t ${DOCKER_REGISTRY}/jenkins_${serviceName}:latest .
                    docker push ${DOCKER_REGISTRY}/jenkins_${serviceName}:latest
                """
            }
        }
    }
}

def deployService(String serviceName) {
    withKubeConfig(
        clusterName: KUBE_CLUSTER_NAME, 
        contextName: KUBE_CONTEXT_NAME, 
        credentialsId: KUBE_CONFIG_ID, 
        serverUrl: KUBE_SERVER_URL
    ) {
        sh """
            cd k8s
            kubectl apply -f ${serviceName}.yaml
            kubectl rollout status deployment/${serviceName}
        """
    }
}

def verifyDeployments() {
    withKubeConfig(
        clusterName: KUBE_CLUSTER_NAME, 
        contextName: KUBE_CONTEXT_NAME, 
        credentialsId: KUBE_CONFIG_ID, 
        serverUrl: KUBE_SERVER_URL
    ) {
        sh '''
            kubectl get pods
            kubectl get services
            kubectl get deployments
        '''
    }
}