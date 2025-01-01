# Installation Guide

Welcome to the alpha-AGI Installation Guide - Whether you're a developer
eager to explore, a system integrator, or an enterprise looking for a
white-label solution, this comprehensive guide ensures a smooth setup
process for your own instance of alpha-AGI and related products.

**Try alpha-AGI** - You don't need to install anything if you want to play with alpha-AGI
and have your API keys to various model services. You can access our free instance on [alphabase.co](https://alphabase.co).
The free instance runs the latest `main-stable` branch from this repository.

## 🧩 Build-your-own

If you want to change the code, have a deeper configuration,
add your own models, or run your own instance, follow the steps below.

### Local Development

**Prerequisites:**

- Node.js and npm installed on your machine.

**Steps:**

1. Clone the alpha-AGI repository:
   ```bash
   git clone https://github.com/AlphabaseOfficial/alpha-AGI.git
   cd alpha-AGI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Your alpha-AGI instance is now running at `http://localhost:3000`.

### Local Production build

The production build is optimized for performance and follows
the same steps 1 and 2 as for [local development](#local-development).

3. Build the production version:
   ```bash
   # .. repeat the steps above up to `npm install`, then:
   npm run build
   ```
4. Start the production server (`npx` may be optional):
   ```bash
   npx next start --port 3000
   ```
   Your alpha-AGI production instance is on `http://localhost:3000`.

### Advanced Customization

Want to pre-enable models, customize the interface, or deploy with username/password or alter code to your needs?
Check out the [Customizations Guide](README.md) for detailed instructions.

## ☁️ Cloud Deployment Options

To deploy alpha-AGI on a public server, you have several options. Choose the one that best fits your needs.

### Deploy on Vercel

Install alpha-AGI on Vercel with just a few clicks.

Create your GitHub fork, create a Vercel project over that fork, and deploy it. Or press the button below for convenience.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fenricoros%2Falpha-AGI&env=OPENAI_API_KEY&envDescription=Backend%20API%20keys%2C%20optional%20and%20may%20be%20overridden%20by%20the%20UI.&envLink=https%3A%2F%2Fgithub.com%2Fenricoros%2Falpha-AGI%2Fblob%2Fmain%2Fdocs%2Fenvironment-variables.md&project-name=alpha-AGI)

### Deploy on Cloudflare

Deploy on Cloudflare's global network by installing alpha-AGI on
Cloudflare Pages. Check out the [Cloudflare Installation Guide](deploy-cloudflare.md)
for step-by-step instructions.

### Docker Deployments

Containerize your alpha-AGI installation using Docker for portability and scalability.
Our [Docker Deployment Guide](deploy-docker.md) will walk you through the process,
or follow the steps below for a quick start.

1. (optional) Build the Docker image - if you do not want to use the [pre-built Docker images](https://github.com/enricoros/alpha-AGI/pkgs/container/alpha-agi):
   ```bash
   docker build -t alpha-agi .
   ```
2. Run the Docker container with either:
   ```bash
   # 2A. if you built the image yourself:
   docker run -d -p 3000:3000 alpha-agi

   # 2B. or use the pre-built image:
   docker run -d -p 3000:3000 ghcr.io/enricoros/alpha-agi

   # 2C. or use docker-compose:
   docker-compose up
   ```
   Access your alpha-AGI instance at `http://localhost:3000`.

If you deploy alpha-AGI behind a reverse proxy, you may want to check out the [Reverse Proxy Configuration Guide](deploy-reverse-proxy.md).

### Kubernetes Deployment

Deploy alpha-AGI on a Kubernetes cluster for enhanced scalability and management. Follow these steps for a Kubernetes deployment:

1. Clone the alpha-AGI repository:
   ```bash
   git clone https://github.com/AlphabaseOfficial/alpha-AGI.git
   cd alpha-AGI
   ```

2. Configure the environment variables:
   ```bash
   cp docs/k8s/env-secret.yaml env-secret.yaml
   vim env-secret.yaml  # Edit the file to set your environment variables
   ```

3. Apply the Kubernetes configurations:
   ```bash
   kubectl create namespace ns-alpha-agi
   kubectl apply -f docs/k8s/alpha-agi-deployment.yaml -f env-secret.yaml
   ```

4. Verify the deployment:
   ```bash
   kubectl -n ns-alpha-agi get svc,pod,deployment
   ```

5. Access the alpha-AGI application:
   ```bash
   kubectl -n ns-alpha-agi port-forward service/svc-alpha-agi 3000:3000
   ```
   Your alpha-AGI instance is now accessible at `http://localhost:3000`.

For more detailed instructions on Kubernetes deployment, including updating and troubleshooting, refer to our [Kubernetes Deployment Guide](deploy-k8s.md).

### Midori AI Subsystem for Docker Deployment

Follow the instructions found on [Midori AI Subsystem Site](https://io.midori-ai.xyz/subsystem/manager/)
for your host OS. After completing the setup process, install the ALPHA-AGI docker backend to the Midori AI Subsystem.

## Enterprise-Grade Installation

For businesses seeking a fully-managed, scalable solution, consider our managed installations.
Enjoy all the features of alpha-AGI without the hassle of infrastructure management. [hello@alphabase.co](mailto:hello@alphabase.co) to learn more.



For any questions or inquiries, please don't hesitate to [reach out to our team](mailto:hello@alphabase.co).
