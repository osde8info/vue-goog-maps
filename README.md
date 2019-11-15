# No Panic

The coolest and easiest Vue App to track your current position and send it to your trusted contacts through SMS.

Built with love using Firebase (Firestore and Firebase Hosting) and Twilio for the SMS capabilities. You have to configure your own secrets for the firebase functions, firestore and firebase hosting if you decide to deploy it there.

Otherwise you may create the Docker image and run it where you are more confortable!

## To Do:

- Add flic button support (In progress)
- User management enhancement for future features
- Future features: Track your pet or your child (An interesting IOT Project)

> _Take care of those you call your own and keep good company_ - Brian May. Good Company

# The Vue side of things!

### Install dependencies

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

# Configuring Firebase

After you create your project in Firebase you need to enable authentication, aatabase, functions and optionally hosting.

## Adding your app to Firebase

- In your project folder go to `Project Configuration` -> `General` tab -> `Add an app`, you'll be able to specify the name of the app and if you want to use Firebase Hosting.
- Once created, search for `Firebase SDK snippet` and select the `Configuration` radio button
- Copy the configuration and paste it in `./src/utils/firebase.js`

### Authentication

- Go to Authentication from the sidebar menu
- Click on the `Access Methods`tab and enable `Google` (you can add as many providers as you wish but you will have to configure them separately)
- Go to `Authorized Domains` and add the domain name you wish to use

### Database

- Go to Database and click on start to use the service

### Functions

- You may do as with previous services to enable it or it will get enabled when using the Firebase CLI

### Hosting

- You may do as with previous services to enable it or it will get enabled when using the Firebase CLI

### Install the Firebase CLI

For detailed install instructions go to: https://firebase.google.com/docs/web/setup#install-cli_deploy

- Install the CLI

```
npm install -g firebase-tools
```

- Sign into Google. Run the following command:

```
firebase login
```

## Deployment

### Deploy the function in Firebase Cloud Functions

The function for this app is in `./functions/index.js`

- Login in Firebase with the CLI
- Setup the variables for Twilio, we need the Account SID, Token and Phone Number. Run the command

```
firebase functions:config:set twilio.sid="ACCOUNT_SID" twilio.token="AUTH_TOKEN" twilio.number="PHONE_NUMBER"
```

- Then you need to deploy the function using

```
firebase deploy --only functions
```

### Deploy the application using Firebase hosting

- Login the Firebase with the CLI
- Compile the aplication using the command

```
npm run build
```

- Deploy the application using the CLI

```
firebase deploy --only hosting
```

## Deploy with Docker

- Install Docker in your environment
- Create the Docker image, using

```
docker build -t <username/repository:tag> .
```

- Upload the image to the registry you are using (i.e: Dockerhub)
- To run the app in your production server you may use the following command: (Remember the port mapping is `<HOST_PORT>:<CONTAINER_PORT>`. The image configuration of this application exposes the `port 80` of the container)

```
docker run -p 80:80 --name <container_name> <username/repository:tag>
```

## Deploy the Docker image using Kubernetes in GCP (GKE)

A good option to host and run our app is using Google Cloud Platform, in which we can store our Docker images and run the application inside a single VM or using Kubernetes, GKE is very easy to start with and ensures we have scalability and many more resources at hand.

There are a few things we need to set up before deploying our app to GKE. The current description is to be ran locally, but can be run from the Console in GCP without installing the CLI (because is already installed).

### Installing gcloud CLI

In the documentation you can find how to install the CLI in other OS https://cloud.google.com/sdk/docs/quickstarts?hl=es-419 . Also make sure to have installed Python 2.7 or greater. Follow the next commands to install the CLI

```
$ cd /opt
## this is the package with binaries for 64 bits
$ sudo curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-231.0.0-linux-x86_64.tar.gz
$ sudo tar zxvf [ARCHIVE_FILE] google-cloud-sdk
$ sudo ./google-cloud-sdk/install.sh
## you may check if is successfully
$ gcloud --version
```

Now you need to login, and you will be asked for the project to use as default, the list of your projects will be displayed on the console

```
$ gcloud init
```

Then it's a good practice to specify the region and zone, if you want to know which zone is better for your project please check the documentation: https://cloud.google.com/compute/docs/regions-zones/?hl=es-419#choosing_a_region_and_zone . In this case I'll be using `us-east1-b`

```
$ gcloud config set compute/zone us-east1-b
```

Install the command tool to manage Kubernetes

```
$ gcloud components install kubectl
```

### Add the app image to Container Registry

Before pulling or pushing images to Container Registry you need to configure Docker to use `gcloud` to authenticate requests to Container Registry.

```
$ gcloud auth configure-docker
```

Before pushing your newly created image to Container Registry you need to tag your image to be able to be pushed to your project registry.

```
$ docker tag <IMAGE-ID> gcr.io/<PROJECT-ID>/<IMAGE_NAME>:<TAG>
```

Now you may push the image to the Registry

```
 docker push gcr.io/<PROJECT-ID>/<IMAGE_NAME>:<TAG>
```

### Creating the cluster in GKE

Now that you have your image in the Container Registry you may use Kubernetes to run your application. A cluster consists of at least one cluster master machine and multiple worker machines called nodes. Nodes are virtual machines that run the Kubernetes processes.
Create your cluster with the following command, it may take a few minutes

```
$ gcloud container clusters create <CLUSTER_NAME>
```

To interact with your cluster you need to authenticate with it, using this command

```
$ gcloud container clusters get-credentials <CLUSTER_NAME>
```

GKE uses Kubernetes objects to create and manage your cluster's resources. Kubernetes provides the Deployment object for deploying stateless applications like web servers. Run the following command

```
$ kubectl create deployment <DEPLOYMENT_NAME> --image=gcr.io/<PROJECT-ID>/<IMAGE_NAME>:<TAG> --port 80
```

After deploying the application, you need to expose it to the Internet so that users can access it. `--port` initializes public `port 80` to the Internet and `--target-port` routes the traffic to `port 80` of the application

```
$ kubectl expose deployment <DEPLOYMENT_NAME> --type LoadBalancer --port 80 --target-port 80
```

You may inspect the Service running the command

```
kubectl get service <DEPLOYMENT_NAME>
```

And you may see the `EXTERNAL-IP` from which you may access your application.
