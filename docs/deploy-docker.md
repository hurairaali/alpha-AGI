# Deploying `alpha-AGI` with Docker

Utilize Docker containers to deploy the alpha-AGI application for an efficient and automated deployment process.
Docker ensures faster development cycles, easier collaboration, and seamless environment management.

## Build and run your container 🔧

1. **Clone alpha-AGI**
   ```bash
   git clone https://github.com/enricoros/alpha-agi.git
   cd alpha-agi
   ```
2. **Build the Docker Image**: Build a local docker image from the provided Dockerfile:
   ```bash
   docker build -t alpha-agi .
   ```
3. **Run the Docker Container**: start a Docker container from the newly built image,
   and expose its http port 3000 to your `localhost:3000` using:
   ```bash
   docker run -d -p 3000:3000 alpha-agi
   ```
4. Browse to [http://localhost:3000](http://localhost:3000)

<br/>

## Run Official Containers 📦

`alpha-AGI` is pre-built from source code and published as a Docker image on the GitHub Container Registry (ghcr).
The build process is transparent, and happens via GitHub Actions, as described in the
file.

### Official Images: [ghcr.io/enricoros/alpha-agi](https://github.com/AlphabaseOfficial/alpha-AGI)

#### Run using *docker* 🚀

```bash
docker run -d -p 3000:3000 ghcr.io/enricoros/alpha-agi:latest
```

#### Run using *docker-compose* 🚀

If you have Docker Compose installed, you can run the Docker container with `docker-compose up`
to pull the Docker image (if it hasn't been pulled already) and start a Docker container. If you want to
update the image to the latest version, you can run `docker-compose pull` before starting the service.

```bash
docker-compose up -d
```

### Make Local Services Visible to Docker 🌐

To make local services running on your host machine accessible to a Docker container, such as a
[Browseless](./config-feature-browse.md) service or a local API, you can follow this simplified guide:

| Operating System  | Steps to Make Local Services Visible to Docker                                                                                                                                                                                                                                                                                                                                               |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Windows and macOS | Use the special DNS name `host.docker.internal` to refer to the host machine from within the Docker container. No additional network configuration is required. Access local services using `host.docker.internal:<PORT>`.                                                                                                                                                                   |
| Linux             | Two options: *A*. Use <ins>--network="host"</ins> (`docker run --network="host" -d alpha-agi`) when running the Docker container to merge the container within the host network stack; however, this reduces container isolation. Alternatively: *B*. Connect to local services <ins>using the host's IP address</ins> directly, as host.docker.internal is not available by default on Linux. |

<br/>

### Reverse Proxy Configuration

A reverse proxy is a server that sits in front of alpha-AGI's container and can forwards web
requests to it. Often used to run multiple web applications, expose them to the internet,
increase security.

If you're deploying alpha-AGI behind a reverse proxy, you may want to see
our [Reverse Proxy Deployment Guide](deploy-reverse-proxy.md) for more information.

<br/>

### More Information

The [`Dockerfile`](../Dockerfile) describes how to create a Docker image. It establishes a Node.js environment,
installs dependencies, and creates a production-ready version of the application as a local container.

The [`docker-compose.yaml`](../docker-compose.yaml) file is configured to run the
official image (alpha-agi:latest). This file is used to define the `alpha-agi` service, to expose
port 3000 on the host, and launch alpha-AGI within the container (startup command).

The [`.github/workflows/docker-image.yml`](../.github/workflows/docker-image.yml) file is used
to build the Official Docker images and publish them to the GitHub Container Registry (ghcr).
The build process is transparent and happens via GitHub Actions.

<br/>

Leverage Docker's capabilities for a reliable and efficient alpha-AGI deployment!