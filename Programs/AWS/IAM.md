- **Users**: mapped to a physical user, has a password for AWS Console
- **Groups**: contains users only
- **Policies**: JSON document that outlines permissions for users or groups 
- **Roles:** for AWS services

### IAM Policies Structure
- Consists of:
	- Version: policy language version, always include "2012-10-17"
	- Id: an identifier for the policy (optional)
	- Statement: one or more individual statements (**required**)

- Statements consists of:
	- Sid: an identifier for the statement (optional)
	- Effect: whether the statement allows or denies access (Allow, Deny)
	- Principle: account / user / role to which this policy applied to
	- Action: list of actions this policy allows or denies
	- Resource: list of resources to which the actions applied to
	- Condition: conditions for when this policy is in effect (optional)

```json
{
	"Version": "2012-10-17",
	"Id": "S3-Account-Permission",
	"Statement": [
		{
			"Sid": "1",
			"Effect": "Allow",
			"Principle": {
				"AWS": ["arn:aws::iam::123456:root"]
			},
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws::s3::mybucket/**"]
		}
	]
}
```
### Best Practices
- Assign users to groups and assign permissions to groups
- Create and use Roles for giving permissions to AWS services
- Use Access Keys for Programming Access (CLI / SDK)
- Audit permission of your account using IAM Credentials Report & IAM Access Advisor 
- Never share IAM users & Access Keys


See also:
- https://000002.awsstudygroup.com/
- https://000048.awsstudygroup.com/