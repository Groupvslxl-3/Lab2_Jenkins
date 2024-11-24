pipeline {
    environment {
        KUBE_CONFIG_ID = 'minikube-jenkins-secret'
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

        stage('Build and Push Images Stage') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        withDockerRegistry(
                            credentialsId: 'docker_hub', 
                            url: 'https://index.docker.io/v1/'
                        ) { 
                            dir('frontend') {
                                sh '''
                                    docker build -t pokilee10/jenkins_frontend:latest .
                                    docker push pokilee10/jenkins_frontend:latest
                                '''
                            }
                        }
                    }
                }

                stage('Build Backend') {
                    steps {
                        withDockerRegistry(
                            credentialsId: 'docker_hub', 
                            url: 'https://index.docker.io/v1/'
                        ) {
                            dir('backend') {
                                sh '''
                                    docker build -t pokilee10/jenkins_backend:latest .
                                    docker push pokilee10/jenkins_backend:latest
                                '''
                            }
                        }
                    }
                }

                stage('Build Admin') {
                    steps {
                        withDockerRegistry(
                            credentialsId: 'docker_hub', 
                            url: 'https://index.docker.io/v1/'
                        ) {
                            dir('admin') {
                                sh '''
                                    docker build -t pokilee10/jenkins_admin:latest .
                                    docker push pokilee10/jenkins_admin:latest
                                '''
                            }
                        }
                    }
                }
            }
        }

        stage('Test') {
            steps {
                withKubeConfig(clusterName: KUBE_CLUSTER_NAME, contextName: KUBE_CONTEXT_NAME, credentialsId: KUBE_CONFIG_ID, serverUrl: KUBE_SERVER_URL) {
                    sh '''
                        kubectl get ns
                        helm ls
                    '''
                }
            }
        }
    }
}