# Deploy `alpha-AGI` with Kubernetes ☸️

In this tutorial, we will guide you through the process of deploying alpha-AGI
in a Kubernetes environment using the kubectl command-line tool.

## First Deployment

### Step 1: Clone the alpha-AGI repository

```bash
$ git clone https://github.com/AlphabaseOfficial/alpha-AGI
$ cd ./alpha-agi/docs/k8s
```

### Step 2: Create the namespace

```bash
$ kubectl create namespace ns-alpha-agi
```

### Step 3: Fill in the key information into env-secret.yaml

All variables are optional. By default, Kubernetes Secret uses Base64 for
encode/decode, so please don't do a git commit after filling in the keys
to avoid leaking sensitive information.

We provide an empty `env-secret.yaml` file as a template.
You can fill in the necessary information using a text editor.

```bash
$ nano env-secret.yaml
```

### Step 4: Deploying Kubernetes Resources

```bash
$ kubectl apply -f alpha-agi-deployment.yaml -f env-secret.yaml
```

### Step 5: Verifying the Resource Statuses

```bash
$ kubectl -n ns-alpha-agi get svc,pod,deployment
NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/svc-alpha-agi   ClusterIP   10.0.198.118   <none>        3000/TCP   63m

NAME                                     READY   STATUS    RESTARTS   AGE
pod/deployment-alpha-agi-xxxxxxxx-yyyyy    1/1     Running   0          39m

NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/deployment-alpha-agi   1/1     1            1           63m
```

### Step 6: Testing the Service

You can test the service by port-forwarding the service to your local machine:

```bash
$ kubectl -n ns-alpha-agi port-forward service/svc-alpha-agi 3000
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

Now you can access the service at `http://localhost:3000`, and you should see the alpha-AGI homepage.

## Updating alpha-AGI

To update alpha-AGI to the latest version:

1. Pull the latest changes from the repository:
   ```bash
   $ git pull origin main
   ```

2. Apply the updated deployment:
   ```bash
   $ kubectl apply -f alpha-agi-deployment.yaml
   ```

This will trigger a rolling update of the deployment with the latest image.

**Note**: If you're deploying alpha-AGI behind a reverse proxy, you may need to configure
your proxy to support streaming. See our [Reverse Proxy Deployment Guide](deploy-reverse-proxy.md) for more information.

Note: For production use, consider setting up an Ingress Controller or Load Balancer instead of using port-forward.