pipeline {
    environment {
        DOCKER_CREDENTIALS_ID = 'docker_hub'
        DOCKER_REGISTRY = 'pokilee10'
        KUBE_CONFIG_ID = 'minikube-jenkins-secret'
        KUBE_CLUSTER_NAME = 'minikube'
        KUBE_CONTEXT_NAME = 'minikube'
        KUBE_SERVER_URL = 'https://192.168.39.98:8443'
        SONAR_TOKEN = credentials('sonarqube')
    }
    agent any

    stages {
        stage('Clone Stage') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Groupvslxl-3/Lab2_Jenkins.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar1'
                    def services = ['admin', 'backend', 'frontend']
                    
                    withSonarQubeEnv('sonar') {
                        services.each { service ->
                            dir(service) {
                                if (service in ['admin', 'frontend']) {
                                    // Cấu hình cho React projects
                                    sh """
                                        ${scannerHome}/bin/sonar-scanner \
                                        -Dsonar.projectKey=${service} \
                                        -Dsonar.projectName=${service} \
                                        -Dsonar.sources=src \
                                        -Dsonar.sourceEncoding=UTF-8 \
                                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                        -Dsonar.exclusions=**/node_modules/**,**/*.spec.ts,**/*.spec.js \
                                        -Dsonar.host.url=https://f2c7-171-250-164-108.ngrok-free.app
                                        -Dsonar.login=${SONAR_TOKEN}
                                    """
                                } else {
                                    // Cấu hình cho Node.js backend
                                    sh """
                                        ${scannerHome}/bin/sonar-scanner \
                                        -Dsonar.projectKey=${service} \
                                        -Dsonar.projectName=${service} \
                                        -Dsonar.sources=. \
                                        -Dsonar.sourceEncoding=UTF-8 \
                                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                        -Dsonar.exclusions=**/node_modules/**,**/*.spec.js,**/test/**,**/tests/** \
                                        -Dsonar.host.url=https://f2c7-171-250-164-108.ngrok-free.app
                                        -Dsonar.login=${SONAR_TOKEN}
                                    """
                                }
                            }
                        }
                    }
                    
                    // Kiểm tra Quality Gate
                    timeout(time: 5, unit: 'MINUTES') {
                        services.each { service ->
                            def qg = waitForQualityGate projectKey: service
                            if (qg.status != 'OK') {
                                error "Quality gate failed for ${service}: ${qg.status}"
                            }
                            echo "Quality gate passed for ${service}"
                        }
                    }
                }
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
                                deployService('k8sFrontend')
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
                                deployService('k8sBackend')
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
                                deployService('k8sAdmin')
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