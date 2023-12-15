This is an example project for using the Sanity Page Tree plugin with Next.JS.

If you want use the data cache feature of Next.JS, you can set the fetchOptions like you would with the next-sanity client.
Example:
```ts
const pageTreeClient = createNextPageTreeClient({
  config: pageTreeConfig,
  client: sanityClient,
  fetchOptions: {
    next: {
      // this way you can cache this information in the data cache. Make sure to revalidate this data when the page tree data changes in Sanity by using a Webhook.
      tags: ['pageTree'] 
    }
  }
});
```
