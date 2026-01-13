---
title: "Convince Your Boss to Try APEX (and ORDS)"
date: 2019-06-20
author: "Jon Dixon"
tags: ["APEX", "ORDS", "Oracle", "Enterprise", "Low Code"]
summary: "Full disclosure, I have absolutely no experience in trying to convince my boss to try APEX or ORDS. I do, however, have experience in basking in the glow of clients who have reaped the benefits of implementing mission critical systems using these two no-cost options of the Oracle database."
---

Full disclosure, I have absolutely no experience in trying to convince my boss to try APEX or ORDS. I do, however, have experience in basking in the glow of clients who have reaped the benefits of implementing mission critical systems using these two no-cost options of the Oracle database.

**TL;DR;** If you are a boss, try out APEX and ORDS today. If you already have an Oracle database, it costs you nothing extra and the upsides for you and your business are tremendous.

If you are a developer looking to convince your boss to adopt APEX and ORDS, then this post is for you. My goal is to arm you with the material you need to make a compelling case for adopting APEX and ORDS. I have broken the post into several major talking points. At the start of each talking point, I have a headline statement (for bosses with short attention spans). I then go on to explain my reasoning in a little more detail (for bosses that need some evidence).

![Main Image](/images/blog/convince-boss-apex-ords/main-image_orig.png)

## Highly Scalable (and easy to understand) Architecture

**APEX is highly scalable with stateless session management and zero data latency; it's an architecture that even your boss will understand.**

![APEX Architecture](/images/blog/convince-boss-apex-ords/apex-architecture_orig.png)

**Data Centric** - APEX, because of its architecture, is very data centric. Both the code and the data exist in the same database enabling zero data access latency. This architecture did no come about by accident; there are good reasons why your code should be right next to your data. I have been using APEX for a while now, but I love this new term 'zero data latency'. Of course, this has been true since the days of HTMLDB. But in this world of super complex, mega frameworks that are so abstracted from the data they need a map to find it, it is very relevant today.

**Stateless** – Much of the scalability of APEX comes from its stateless nature. The API calls to the Oracle APEX engine use the standard Oracle database connection pool. This means that once an API call is processed and the response is sent back to the browser, the connection is returned to the database connection pool and can be used by any other request. The database sessions are only active when performing a request, otherwise, the they are inactive and do not consume any database resources. This allows APEX to handle tens of thousands of users simultaneously.

## Stability & Innovation

**APEX is very stable, easy to upgrade and new features are coming thick and fast.**

![Stability and Innovation](/images/blog/convince-boss-apex-ords/stability-and-innovation_orig.png)

You may think stability and innovation don't belong in the same sentence. When you are talking about APEX, however, they really do. I have never undertaken a large JavaScript framework project. I can imagine, however, that as a boss it is a little un-nerving heading into a multi-year project with half a dozen technologies, many of which may not exist by the time the project is over. APEX has been around for 15+ years and there is no sign of it going anywhere. You may think, "So what, Windows has been around for longer and it is still awful.". APEX is different. The pace of new (and useful) features over the past 2-3 years (especially in the areas of UI, Single Sign On and integration capabilities) has been fantastic. BTW, there is no sign of that pace letting up. With multiple releases a year you get the option of up taking these improvements at regular intervals.

Hold on a minute, that doesn't sound very stable. What I haven't mentioned is that the APEX development team is world famous for providing upgrades that do not break your existing Apps. One of the ways they achieve this is by allowing apps to run in previous versions with 'Compatibility Mode'. This means that in most cases, you can do the upgrade and then switch on new functionality in individual apps, as and when you need it. There are stories every month of APEX users who have upgraded from APEX 3 (released in 2007) to the current version without anything breaking. Can you imagine doing that with any other development framework?

## Beautiful UI

**Your users will love using APEX Applications!**

![Beautiful UI](/images/blog/convince-boss-apex-ords/beautiful-ui_orig.png)

If you had experience of APEX from version 4 (or before), boy are you in for a treat. Applications built with APEX look as good as any other framework and are quite frankly a joy to use. We are long past the dystopian days of automaton workers using systems they are forced to use. When people use Enterprise systems these days they expect more. While you may feel like dark mode is a fad, Apple is about to release it across all of the Operating Systems. Believe me, your Enterprise users will be using dark mode soon enough. Wouldn't it be great if your development platform could make dark mode happen at the flick of a switch? APEX has your back. Dark mode is already available in APEX Builder and will be coming soon as an end user theme style. It goes much further than that too. APEX's Universal Theme delivers UI components that would otherwise consume hundreds of hours of custom development. For a peak at what is available, check out the Universal Theme demo App https://apex.oracle.com/ut

Finally, with accessibility concerns finally being taken seriously, it is good to know that the APEX team has baked accessibility checks right into the product. They even have accessibility tested themes available. Check out this video for more details on Accessibility in APEX.

## Integration Hub

**APEX and ORDS provide you everything you need to host and consume REST based web services to meet all of your integration needs.**

![ORDS Integration](/images/blog/convince-boss-apex-ords/ords_orig.png)

Oracle REST Data Services (ORDS) has two roles in an APEX world. One is to service APEX pages to end users and the other is to host REST based web services. The ability to host REST based web services based on SQL and PL/SQL is extremely powerful. It allows you to provide external systems secure access to the data in your Oracle database. This can be useful for integrations and even for hosting web services to be consumed by native mobile applications.

APEX comes with a number of features to facilitate consumption of any REST based web services. For example, Web Source Modules provide a wizard-based approach to configuring components that allow you to create reports and forms directly on web services. This extends the reach of APEX outside the database and prevents un-necessary syncing of data to and from other systems.

## Authentication Choice

**With APEX Social Sign-In you can use just about any OAuth identity provider to authenticate your users.**

Authentication can be a complex proposition. If you store usernames and passwords yourself you really need to know what you are doing. The last thing you want is for your user account data to be compromised. It is generally far safer to outsource this task to a trustworthy identity provider such as Okta or Auth0. You could also outsource this task to platforms your users already use such as Office 365, Google and even Facebook.

By providing the ability to create custom authentication schemes, APEX has always provided flexibility in authenticating users. Custom authentication schemes allow you to create code that could use just about anything to authenticate a user. Since APEX Social Sign-In was introduced in APEX 18.1, APEX authentication has reached a whole new level. You can now setup declarative authorization schemes for OAuth-capable identity providers and APEX handles calling the necessary web services to authenticate your user. Taking Okta for example. Okta can now be your source of truth for handling all authentication in your company. All of your other systems (Email, ERP and your APEX Apps) can then use Okta to authenticate your users.

## Features and Utilities

**APEX provides many useful features and utilities out of the box, that would otherwise require numerous third-party libraries.**

![Tools](/images/blog/convince-boss-apex-ords/tools_orig.png)

To name a few:

- Out of the Box Authorization
- Multi-Language and globalization features
- Sending Emails
- Email Templates
- Extensible plugin framework with hundreds of available plugins
- Building and parsing JSON
- Excel and CSV parsing
- Zipping and Unzipping files
- JWT Handling
- String manipulation utilities
- and many more…

The benefit of having these utilities bundled with APEX are that fixes and enhancements are handled by Oracle and released with each new version of APEX. In contrast, having these types of utilities spread out amongst a number of providers means you get fixes when they feel like. It also means that as those providers drop by the wayside you are left having to merge new libraries into your applications.

## Equally at Home On-Premise and in the Cloud

**APEX applications can be hosted in the cloud just as easily as on-premise.**

![APEX in the Cloud](/images/blog/convince-boss-apex-ords/apex-cloud_orig.png)

The APEX architecture lends itself well to running in the cloud and there are numerous options for hosting APEX in the cloud.

**PaaS** - There are turn key PaaS solutions (e.g. Exadata Express from Oracle) that host the entire APEX and ORDS architecture at a very reasonable price. All you need is a credit card and a browser to get started.

**IaaS** - You can also install APEX and ORDS yourself on infrastructure from just about any cloud provider. This allows you complete flexibility to size the environment as you wish, but you will need to perform much of the maintenance (backups, upgrades etc.) yourself.

## Low Code and High Productivity

**APEX is building on its high productivity heritage to establish itself as a legitimate contender in the Low Code space.**

![APEX Low Code](/images/blog/convince-boss-apex-ords/apexlowcode_orig.png)

APEX has always been known for allowing developers to build useful, scalable applications in a very short period of time. Over the past year and a half, more and more features have been added to establish APEX as a top contender in the low code pace. These features include wizard-based development of web service integrations and pre-built components that can be added to existing applications or used to build brand new applications. APEX is already at the stage where you can build fully functional applications starting from the upload of an Excel spreadsheet. These kinds of features are allowing APEX to break out of the IT department and into the business. It is here where (handled the right way), citizen developers can become productive with APEX with just a small amount of oversight from IT.

## Leverage Existing Talent

**Many of our customers run Oracle e-Business Suite and have a number of PL/SQL developers on staff. How to leverage this talent and still provide your users with applications they will love using?**

![Existing Talent](/images/blog/convince-boss-apex-ords/existing-talent_orig.png)

An experienced PL/SQL developer can be up and running on APEX in a matter of days. Five years of Oracle database, SQL and PL/SQL experience gives you about 70% of the skills to be a high performing APEX developer. Sprinkle in a little JavaScript, CSS and web services experience and you are 100% of the way there.

## No Cost Option of the Oracle Database

**APEX and ORDS are no cost options of the Oracle Database. If you own an Oracle database license you own APEX and ORDS.**

![APEX No Cost](/images/blog/convince-boss-apex-ords/apex-no-cost_orig.png)

I purposely left this item to last because in my opinion, APEX and ORDS stand on their own against any enterprise-ready development platform. Having said that, if you own an Oracle database license you really should be using APEX and ORDS because it isn't going to cost you a penny extra. In addition to the no extra cost for the software, you will also need very little additional hardware. A VM with 4GB of RAM and 15GB disk is more than enough to host ORDS, which is the only other component you need.

## Conclusion

It's very hard to write a pithy conclusion to summarize everything I have said in this post. There are also, no doubt, a number of important APEX benefits that I have not included. If you read this post and you are a developer keen to bring APEX and ORDS into your organization, I encourage you to use some of this material to make a case. If you are a boss and you are looking to adopt a development platform that will deliver real value to your business, then I urge you to visit the following links to learn more about what APEX and ORDS can offer your organization:

- [APEX Shortcuts](https://apex.oracle.com/shortcuts)
- [APEX Office Hour Videos](https://apex.oracle.com/officehours)
- [APEX Learning](https://apex.oracle.com/learn)

---

Jon Dixon, Co-Founder JMJ Cloud
