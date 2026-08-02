# Testing

Prefer `mockGetUrls()` for stubbing GET routes instead of hand-rolled `apiClient.get` `mockImplementation` chains:

```ts
mockGetUrls()
	.url(ApiPaths.WORKSPACE)
	.respond(workspace)
	.url(ApiPaths.CURRENT_TEAMMATE)
	.respond(teammate)
	.apply()
```

Use `.fail(status)` when a route should reject (wraps `mockError` internally):

```ts
mockGetUrls()
	.url(ApiPaths.VERIFY_INVITE)
	.respond(fakeInvite)
	.url(ApiPaths.CHECK_USERNAME)
	.fail(HttpStatusCode.BadRequest)
	.apply()
```
