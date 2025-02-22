### Bind Mounts

Bind mounts allow you to mount files from your host computer into your container. This allows you to use the containers a much more flexible way than previously possible: you don't have to know what files the container will have _when you build it_ and it allows you to determine those files _when you run it_.

```sh
# project-files-for-complete-intro-to-containers-v2/static-asset-project
# from the root directory of your Astro app 
docker run --mount type=bind,source="$(pwd)"/dist,target=/usr/share/nginx/html -p 8080:80 nginx:latest
```

This is how you do bind mounts. It's a bit verbose but necessary. Let's dissect it.
- We use the `--mount` flag to identify we're going to be mounting something in from the host.
- As far as I know the only two types are `bind` and `volume`. Here we're using `bind` because we to mount in some piece of already existing data from the host.
- In the source, we identify what part of the host we want to make readable-and-writable to the container. It has to be an absolute path (e.g we can't say `"./dist"`) which is why use the `"$(pwd)"` to get the **p**resent **w**orking **d**irectory to make it an absolute path.
- The target is where we want those files to be mounted in the container. Here we're putting it in the spot that NGINX is expecting.
- As a side note, you can mount as many mounts as you care to, and you mix bind and volume mounts. NGINX has a default config that we're using but if we used another bind mount to mount an NGINX config to `/etc/nginx/nginx.conf` it would use that instead.

### Volumes

Bind mounts are great for when you need to share data between your host and your container as we just learned. Volumes, on the other hand, are so that your containers can maintain state between runs. So if you have a container that runs and the next time it runs it needs the results from the previous time it ran, volumes are going to be helpful. Volumes can not only be shared by the same container-type between runs but also between different containers. Maybe if you have two containers and you want to log to consolidate your logs to one place, volumes could help with that.

They key here is this: bind mounts are file systems managed the host. They're just normal files in your host being mounted into a container. Volumes are different because they're a new file system that Docker manages that are mounted into your container. These Docker-managed file systems are not visible to the host system (they can be found but it's designed not to be.)

```sh
docker run --rm --env DATA_PATH=/data/num.txt --mount type=volume,src=incrementor-data,target=/data incrementor

# Named volume called: `incrementor-data`
# The `--env` flag to set the DATA_PATH to be where we want Node.js to write the file
```

### Networking

So why do we care about networking? Many reasons! Let's make our Node.js app a bit more complicated. What if it had a database? Let's connect it to a running MongoDB database. We _could_ start this MongoDB database inside of the same container and this might be fine for development on the smallest app but it'd be better and easier if we could just the [mongo](https://hub.docker.com/_/mongo) container directly. But if I have two containers running at the same time (the app containers and the MongoDB container) how do they talk to each other? Networking!
There are several ways of doing networking within Docker and all of them work differently depending which operating system you're on. Again, this is a deep subject and we're just going to skim the surface. We're going to deal with the simplest, the bridge networks. There is a default bridge network running all the time

### Docker Compose

Docker Compose allows us the ability to coordinate multiple containers and do so with one YAML file. This is great if you're developing a Node.js app and it requires a database, caching, or even if you have two+ separate apps in two+ separate containers that depend on each other or all the above! Docker Compose makes it really simple to define the relationship between these containers and get them all running with one `docker compose up`.

### Kubernetes

Kubernetes is a **container orchestration tool**. It allows you to manage large, complicated clusters of containers to multiple different hosts. It's a complicated tool that solves complicated problems. As such, we are going to do a hello world so you can understand what it is, what it can do, and then leave you to explore more on your own.
So let's go over a few fundamental concepts here:
- The **control plane** is a server that coordinates everything else. This is the brain on of your cluster. Some cloud providers actually won't charge you to run the control plane. You will see this referred to sometimes at the "master node" but it has since been renamed.

- **Nodes** (not to be confused with Node.js) are the worker servers that are actually going to be running your containers. One node can one or multiple containers. If you're running machine learning and you need big, beefy servers to churn through the learning, your node may only run one container. If you're running a Node.js server like we are, you'll have many containers on one node. Technically, a Node is just a deploy target. It could itself be a VM or a container, or as we said it could be a metal-and-silicon server. It's not really important. Just think of it as a destination for containers.

- A **pod** is basically an atom to a cluster: it's a thing that can't be divided and thus needs to be deployed together. Imagine if you had several types of containers that all worked together as one unit and wouldn't work without each other. In this case, you'd put those into a pod. In many cases and what we're going to do today is do one-container-one-pod. Our app stands alone and thus can be deployed independently. We'll keep the MongoDB pod and App pod separate because they can scale individually.

- A **service** is a group of pods that make up one backend (services can be other things but bear with me for a second), so to speak. Think one microservice is a group of microservices. Pods are scaling up and down all the time and thus it's unreliable to rely on a single pod's IP. So if I tell the User service to rely on this specific IP for the Admin service, that IP might disappear as that pod is scalled up and down. Enter services. This is a reliable entry point so that these services can talk to each other independent of the relative scale of each other. Like you can have one-container-one-pod, you can have one-pod-one-service as well which means you can have one-container-one-pod-one-service. Services can be more than a backend, they can machine learning nodes, database, caches, etc.

- A **deployment** is where you describe what you want the state of your pods to be and then Kubernetes works to get your cluster into that state.

### References
- https://containers-v2.holt.courses/