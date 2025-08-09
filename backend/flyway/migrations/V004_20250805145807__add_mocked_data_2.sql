-- Add users mocked data
INSERT INTO users (id, userName, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES (
        '70875304-d60a-467f-8cf8-eb446aad7f5f', "jdoe", "password123",
        "John", "Doe", "jdoe@example.com", "user",
        '2025-08-05 08:03:11', '2025-08-05 08:03:11'
    );
INSERT INTO users (id, userName, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES (
        'f7d180d9-dbbe-4bf4-8450-c9141f320826', "asmith", "password123",
        "Alice", "Smith", "asmith@example.com", "user",
        '2025-08-05 08:03:11', '2025-08-05 08:03:11'
    );
INSERT INTO users (id, userName, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES (
        '9cbf94dd-10df-47c8-abc4-c124791dae74', "bwayne", "password123",
        "Bruce", "Wayne", "bwayne@example.com", "user",
        '2025-08-05 08:03:11', '2025-08-05 08:03:11'
    );
INSERT INTO users (id, userName, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES (
        '6b8fe1ec-095b-43e5-8bd6-6760694caccc', "ckent", "password123",
        "Clark", "Kent", "ckent@example.com", "user",
        '2025-08-05 08:03:11', '2025-08-05 08:03:11'
    );
INSERT INTO users (id, userName, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES (
        'e5ed73c9-9e35-4a27-8d8b-cdd00019657b', "dprince", "password123",
        "Diana", "Prince", "dprince@example.com", "user",
        '2025-08-05 08:03:11', '2025-08-05 08:03:11'
    );

-- Add books mocked data
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '5b857ba9-3b52-46d4-a4bb-b2640a39db2b',
    "Unlocking Android",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson.jpg",
    "1933988673",
    19,
    19,
    416,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "Unlocking Android: A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);

INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '825c0ff5-0599-4127-af19-9a63bfe3c1d5',
    "Android in Action, Second Edition",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson2.jpg",
    "1935182722",
    33,
    33,
    592,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "Android in Action, Second Edition is a comprehensive tutorial for Android developers. Taking you far beyond 'Hello Android,' this fast-paced book puts you in the driver's seat as you learn important architectural concepts and implementation strategies. You'll master the SDK, build WebKit apps using HTML 5, and even learn to extend or replace Android's built-in features by building useful and intriguing examples.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);

INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'aa6dddbf-d03f-4d6c-be25-dafdd8feacc5',
    "Specification by Example",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/adzic.jpg",
    "1617290084",
    18,
    18,
    0,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);

INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'c5304b68-66c0-42c8-a594-431bd2ff252f',
    "Flex 3 in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ahmed.jpg",
    "1933988746",
    14,
    14,
    576,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "New web applications require engaging user-friendly interfaces and the cooler, the better. With Flex 3, web developers at any skill level can create high-quality, effective, and interactive Rich Internet Applications (RIAs) quickly and easily. Flex removes the complexity barrier from RIA development by offering sophisticated tools and a straightforward programming language so you can focus on what you want to do instead of how to do it. And now that the major components of Flex are free and open-source, the cost barrier is gone, as well! Flex 3 in Action is an easy-to-follow, hands-on Flex tutorial. Chock-full of examples, this book goes beyond feature coverage and helps you put Flex to work in real day-to-day tasks. You'll quickly master the Flex API and learn to apply the techniques that make your Flex applications stand out from the crowd.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);

INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'edd3c35b-527e-4e67-bfcb-b546ce48ca85',
    "Flex 4 in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ahmed2.jpg",
    "1935182420",
    14,
    14,
    600,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "Using Flex, you can create high-quality, effective, and interactive Rich Internet Applications (RIAs) quickly and easily. Flex removes the complexity barrier from RIA development by offering sophisticated tools and a straightforward programming language so you can focus on what you want to do instead of how to do it. And the new features added in Flex 4 give you an even wider range of options!",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);

INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '4fce7bc0-36b5-4474-a37a-79e2e9e10acf',
    "Collective Intelligence in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/alag.jpg",
    "1933988312",
    25,
    25,
    425,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "There's a great deal of wisdom in a crowd, but how do you listen to a thousand people talking at once  Identifying the wants, needs, and knowledge of internet users can be like listening to a mob.    In the Web 2.0 era, leveraging the collective power of user contributions, interactions, and feedback is the key to market dominance. A new category of powerful programming techniques lets you discover the patterns, inter-relationships, and individual profiles   the collective intelligence   locked in the data people leave behind as they surf websites, post blogs, and interact with other users.    Collective Intelligence in Action is a hands-on guidebook for implementing collective-intelligence concepts using Java. It is the first Java-based book to emphasize the underlying algorithms and technical implementation of vital data gathering and mining techniques like analyzing trends, discovering relationships, and making predictions. It provides a pragmatic approach to personalization by combining content-based analysis with collaborative approaches.    This book is for Java developers implementing collective intelligence in real, high-use applications. Following a running example in which you harvest and use information from blogs, you learn to develop software that you can embed in your own applications. The code examples are immediately reusable and give the Java developer a working collective intelligence toolkit.    Along the way, you work with, a number of APIs and open-source toolkits including text analysis and search using Lucene, web-crawling using Nutch, and applying machine learning algorithms using WEKA and the Java Data Mining (JDM) standard.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '679d7f9b-86c8-4675-9cef-e745d6ce3bd7',
    "Zend Framework in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/allen.jpg",
    "1933988320",
    47,
    47,
    432,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "Zend Framework in Action is a comprehensive tutorial that shows how to use the Zend Framework to create web-based applications and web services. This book takes you on an over-the-shoulder tour of the components of the Zend Framework as you build a high quality, real-world web application.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'c9ff1b35-552e-4959-9359-dd3b69472c88',
    "Flex on Java",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/allmon.jpg",
    "1933988797",
    44,
    44,
    265,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "A beautifully written book that is a must have for every Java Developer.       Ashish Kulkarni, Technical Director, E-Business Software Solutions Ltd.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'c8e3c6d6-d532-4799-94af-8f5fa444ee23',
    "Griffon in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/almiray.jpg",
    "1935182234",
    33,
    33,
    375,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "Griffon in Action is a comprehensive tutorial written for Java developers who want a more productive approach to UI development. In this book, you'll immediately dive into Griffon. After a Griffon orientation and a quick Groovy tutorial, you'll start building examples that explore Griffon's high productivity approach to Swing development. One of the troublesome parts of Swing development is the amount of Java code that is required to get a simple application off the ground.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '796c3bde-2a06-4290-aa9f-33d478bc61c8',
    "OSGi in Depth",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/alves.jpg",
    "193518217X",
    43,
    43,
    325,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "Enterprise OSGi shows a Java developer how to develop to the OSGi Service Platform Enterprise specification, an emerging Java-based technology for developing modular enterprise applications. Enterprise OSGi addresses several shortcomings of existing enterprise platforms, such as allowing the creation of better maintainable and extensible applications, and provide a simpler, easier-to-use, light-weight solution to enterprise software development.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'd78ae155-0af9-49f8-a2df-d9c67d3df2f3',
    "Flexible Rails",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/armstrong.jpg",
    "1933988509",
    41,
    41,
    592,
    'ee948f5e-b92b-4e7e-b786-30cc0b27048c',
    "'Flexible Rails created a standard to which I hold other technical books. You definitely get your money's worth.'",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'f2f2d5ff-8f35-4be7-9259-505a3d6bd274',
    "Hello! Flex 4",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/armstrong3.jpg",
    "1933988762",
    13,
    13,
    258,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "Hello! Flex 4 progresses through 26 self-contained examples selected so you can progressively master Flex. They vary from small one-page apps, to a 3D rotating haiku, to a Connect Four-like game. And in the last chapter you'll learn to build a full Flex application called SocialStalkr   a mashup that lets you follow your friends by showing their tweets on a Yahoo map.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '690a70d4-a89b-4ec3-9e8a-e3fbdffd14d1',
    "Coffeehouse",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/asher.jpg",
    "1884777384",
    32,
    32,
    316,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "Coffeehouse is an anthology of stories, poems and essays originally published on the World Wide Web.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '9a0baa55-03ce-4cce-adf3-4784e4797a06',
    "Team Foundation Server 2008 in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/azher.jpg",
    "1933988592",
    35,
    35,
    344,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "In complex software projects, managing the development process can be as critical to success as writing the code itself. A project may involve dozens of developers, managers, architects, testers, and customers, hundreds of builds, and thousands of opportunities to get off-track. To keep tabs on the people, tasks, and components of a medium- to large-scale project, most teams use a development system that allows for easy monitoring, follow-up, and accountability.    Microsoft Team Foundation Server 2008 (TFS), the server component of Microsoft's Visual Studio Team System (VSTS), provides a powerful collaborative platform for software-development teams. The product offers an integrated toolset for tracking work items, creating test cases, managing source code, generating builds, constructing database schemas, and so on. Because in software development one size does not fit all, TFS provides process customization, project management, and reporting capabilities to build solutions around your requirements.    Team Foundation Server 2008 in Action is a hands-on guide to Team Foundation Server 2008. Written for developers with a good handle on TFS basics, this book shows you how to solve real-life problems. It's not a repetition of Microsoft's product documentation. Team Foundation Server 2008 in Action is a practitioner's handbook for how to work with TFS under common constraints. This book walks you through real-life software engineering problems based on hundreds of hours of TFS experience.    You'll benefit from expert author Jamil Azher's extensive interactions with members of Microsoft's TFS team and MVPs, survey feedback from the author's blog, and interviews with organizations and user groups using TFS. Instead of just offering a high-level overview, the book provides detailed solutions for solving common   and not-so-common   problems using TFS. It discusses the strengths as well as weaknesses of TFS, and suggests appropriate problem resolution steps, workarounds, or custom solutions.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '5bb6d3ba-537c-494a-9085-bcfe47f2c245',
    "Brownfield Application Development in .NET",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/baley.jpg",
    "1933988711",
    50,
    50,
    550,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "Brownfield Application Development in .Net shows you how to approach legacy applications with the state-of-the-art concepts, patterns, and tools you've learned to apply to new projects. Using an existing application as an example, this book guides you in applying the techniques and best practices you need to make it more maintainable and receptive to change.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '1394174b-5a6e-458a-88c8-4d6656484ff7',
    "MongoDB in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/banker.jpg",
    "1935182870",
    31,
    31,
    0,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "MongoDB In Action is a comprehensive guide to MongoDB for application developers. The book begins by explaining what makes MongoDB unique and describing its ideal use cases. A series of tutorials designed for MongoDB mastery then leads into detailed examples for leveraging MongoDB in e-commerce, social networking, analytics, and other common applications.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '4c6887cd-e5c5-4470-8313-9fb48a3ce662',
    "Distributed Application Development with PowerBuilder 6.0",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/banker.jpg",
    "1884777686",
    14,
    14,
    504,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "Distributed Application Development with PowerBuilder 6.0 is a vital source for the PowerBuilder programmer; it provides the sort of detailed coverage of Distributed PowerBuilder that you can find nowwhere else.    The book opens with a discussion of distributed computing in general, as well as its design principles and technologies. Then Distributed PowerBuilder is examined in detail. By building a simple application step by step, the author discusses all of the concepts and components needed for building a PowerBuilder application and shows how to make the application available over a network.    Finally, the author explores how PowerBuilder can be used in distributed solutions both with and without using DPB.    Distributed Application Development with PowerBuilder 6.0 is for any PowerBuilder developer looking for information on distributed computing options with the PowerBuilder environment. IS managers, system architects, and developers using many different technologies can learn how PowerBuilder can be used as all or part of the solution for building distributed applications.    The main topic of this book is Distributed PowerBuilder (DPB). It covers the basics of building a DPB application and walks through each new feature with examples including the Shared object, DataWindow synchronization, Server Push and Web.PB. It also explains distributed computing technologies and design principles so that your application can be built to handle the stresses of a distributed environment.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '40671057-2871-4843-b1a3-eb4919d6fb05',
    "Jaguar Development with PowerBuilder 7",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/barlotta2.jpg",
    "1884777864",
    36,
    36,
    550,
    'ee948f5e-b92b-4e7e-b786-30cc0b27048c',
    "Jaguar Development with PowerBuilder 7 is the definitive guide to distributed application development with PowerBuilder. It is the only book dedicated to preparing PowerBuilder developers for Jaguar applications and has been approved by Sybase engineers and product specialists who build the tools described in the book.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '2e55112a-4c74-4054-8a36-ad970b790092',
    "Taming Jaguar",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/barlotta3.jpg",
    "1884777686",
    29,
    29,
    362,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "Taming Jaguar is part of the PowerBuilder Developer's series, which includes Distributed Application Development with PowerBuilder 6 and Jaguar Development with PowerBuilder 7.    An application server is the heart of your enterprise computing architecture, centralizing your web content, business logic, and access to your data and legacy applications. Sybase's application server, Jaguar CTS, delivers performance, scalability, and flexibility running CORBA , COM, Java/EJB, C++, and PowerBuilder components.    If you are looking to adopt Jaguar in your enterprise, look no further. Taming Jaguar shows you how to solve the real-world problems of installing, trouble-shooting, designing, developing, and maintaining a Jaguar application. Topical chapters are organized in a Q & A format making it easy for you to quickly find the solution to your problem. They also provide foundational and background information as well as detailed technical how-tos.    Although designed so you can find your problems easily, this book is meant to be read cover-to-cover with each chapter discussing its topic exhaustively.    What's inside:    J2EE development  Java Servlets  Jaguar administration & code balancing  EJBs  Web development with PowerDynamo  Advanced component design",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '0418ba35-d180-4c9c-8cca-b9b41a46e65e',
    "3D User Interfaces with Java 3D",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/barrilleaux.jpg",
    "1884777902",
    26,
    26,
    520,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "3D User Interfaces with Java 3D is a practical guide for providing next-generation applications with 3D user interfaces for manipulation of in-scene objects. Emphasis is on standalone and web-based business applications, such as for online sales and mass customization, but much of what this book offers has broad applicability to 3D user interfaces in other pursuits such as scientific visualization and gaming.  This book provides an extensive conceptual framework for 3D user interface techniques, and an in-depth introduction to user interface support in the Java 3D API, including such topics as picking, collision, and drag-and-drop. Many of the techniques are demonstrated in a Java 3D software framework included with the book, which also provides developers with many general-purpose building blocks for constructing their own user interfaces.    Applications and their use of 3D are approached realistically. The book is geared towards sophisticated user interfaces for the 'everyday user' who doesn't have a lot of time to learn another application--much less a complicated one--and an everyday computer system without exotic devices like head mounted displays and data gloves. Perhaps the best description of this book is: 'A roadmap from Java 3D to 'Swing 3D'.'",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '61d2f03f-55a6-4768-9ca0-fd717629eaff',
    "Hibernate in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bauer.jpg",
    "193239415X",
    6,
    6,
    400,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "'2005 Best Java Book!' -- Java Developer's Journal",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'a5b45d98-5439-4450-891a-269fd7dada03',
    "Hibernate in Action (Chinese Edition)",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bauer-cn.jpg",
    "",
    9,
    9,
    400,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '2013d438-5bd7-4bf5-9cc5-735a7495063c',
    "Java Persistence with Hibernate",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bauer2.jpg",
    "1932394885",
    35,
    35,
    880,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "'...this book is the ultimate solution. If you are going to use Hibernate in your application, you have no other choice, go rush to the store and get this book.' --JavaLobby",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '5a3531d5-8e08-4066-a92d-e8d80b3d5546',
    "JSTL in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bayern.jpg",
    "1930110529",
    46,
    46,
    480,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "JSTL is an important simplification of the Java web platform. With JSTL, page authors can now write dynamic pages using standard HTML-like tags and an easy-to-learn expression language. JSTL is a standard from the Java Community Process, and its expression language will become part of JSP 2.0.    JSTL in Action shows you how to write rich, dynamic web pages without programming. From simple loops to tricky XML processing, every feature of JSTL is covered and exercised in numerous useful examples. Whether you are a novice page author or an experienced Java programmer, this book shows you easy ways to create powerful web sites.    To help readers who don't already have a JSP container run the examples in the book, there's a free companion download here. This bundle contains a ready-to-run JSP container, a JSTL implementation, and all the book's examples.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'cd695773-5ffd-4fc0-8a80-e4d384f0d564',
    "iBATIS in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/begin.jpg",
    "1932394826",
    37,
    37,
    384,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "Gets new users going and gives experienced users in-depth coverage of advanced features.       Jeff Cunningham, The Weather Channel Interactive",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '26c0c82d-0730-4b62-bc8f-36e99c5c68e4',
    "Designing Hard Software",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/begin.jpg",
    "133046192",
    27,
    27,
    350,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "'This book is well written ... The author does not fear to be controversial. In doing so, he writes a coherent book.' --Dr. Frank J. van der Linden, Phillips Research Laboratories",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'b1a5e783-cee6-49a6-8939-cc6e017843f6',
    "Hibernate Search in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bernard.jpg",
    "1933988649",
    19,
    19,
    488,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "'A great resource for true database independent full text search.' --Aaron Walker, base2Services",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '52a8e46f-1965-4caa-b4e2-b6db5e9a7174',
    "jQuery in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bibeault.jpg",
    "1933988355",
    12,
    12,
    376,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "'The best-thought-out and researched piece of literature on the jQuery library.' --From the forward by John Resig, Creator of jQuery",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '0fe7225f-c962-4d6c-8d26-f3c6babcf865',
    "jQuery in Action, Second Edition",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bibeault2.jpg",
    "1935182323",
    11,
    11,
    488,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "jQuery in Action, Second Edition is a fast-paced introduction to jQuery that will take your JavaScript programming to the next level. An in-depth rewrite of the bestselling first edition, this edition provides deep and practical coverage of the latest jQuery and jQuery UI releases. The book's unique 'lab pages' anchor the explanation of each new concept in a practical example. You'll learn how to traverse HTML documents, handle events, perform animations, and add Ajax to your web pages. This comprehensive guide also teaches you how jQuery interacts with other tools and frameworks and how to build jQuery plugins.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '2f8b83c5-991d-4790-98a4-c9f817294c0b',
    "Building Secure and Reliable Network Applications",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/birman.jpg",
    "1884777295",
    6,
    6,
    591,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "'... tackles the difficult problem of building reliable distributed computing systems in a way that not only presents the principles but also describes proven practical solutions.' --John Warne, BNR Europe",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '8f4d6aec-f46e-4db8-92e8-2f6d564801f9',
    "Ruby for Rails",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/black.jpg",
    "1932394699",
    25,
    25,
    532,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "The word is out: with Ruby on Rails you can build powerful Web applications easily and quickly! And just like the Rails framework itself, Rails applications are Ruby programs. That means you can   t tap into the full power of Rails unless you master the Ruby language.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'dc8abb43-e500-4969-8b7c-595af1b413e3',
    "The Well-Grounded Rubyist",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/black2.jpg",
    "1933988657",
    36,
    36,
    520,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "What would appear to be the most complex topic of the book is in fact surprisingly easy to assimilate, and one realizes that the efforts of the author to gradually lead us to a sufficient knowledge of Ruby in order to tackle without pain the most difficult subjects, bears its fruit.       Eric Grimois, Developpez.com",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '09d86af8-796d-4fb8-b93f-28f3b0a5745a',
    "Website Owner's Manual",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/boag.jpg",
    "1933988452",
    20,
    20,
    296,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "Website Owner's Manual helps you form a vision for your site, guides you through the process of selecting a web design agency, and gives you enough background information to make intelligent decisions throughout the development process. This book provides a jargon-free overview of web design, including accessibility, usability, online marketing, and web development techniques. You'll gain a practical understanding of the technologies, processes, and ideas that drive a successful website.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '6d42b5ec-ec57-4c3b-a51f-9f67735d26a9',
    "ASP.NET 4.0 in Practice",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/bochicchio.jpg",
    "1935182463",
    36,
    36,
    504,
    '65ba33b8-0f10-47c2-bbf0-2c8086ad588d',
    "ASP.NET 4.0 in Practice contains real world techniques from well-known professionals who have been using ASP.NET since the first previews.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'b42078f9-01d8-4864-888d-dee2d2ae1953',
    "Hello! Python",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/briggs.jpg",
    "1935182080",
    49,
    49,
    350,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "Hello! Python fully covers the building blocks of Python programming and gives you a gentle introduction to more advanced topics such as object oriented programming, functional programming, network programming, and program design. New (or nearly new) programmers will learn most of what they need to know to start using Python immediately.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '4c8cf7dd-91b1-4304-a06f-7f6e1d3eda53',
    "PFC Programmer's Reference Manual",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/brooks.jpg",
    "1884777554",
    19,
    19,
    368,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "PFC Programmers' Reference Manual provides information that should prove indispensible for the PowerBuilder programmer trying to learn the PowerBuilder Foundation Classes. It lists all of the objects and functions that they might use for a project with notes from the author on each function. Service-based architecture and appropriate object-oriented techniques are stressed throughout.    The more difficult objects and services are given special attention; these are the ones that are sure to enhance your image as an expert in this emerging technology. The text is written with the same easy-to-understand prose that has marked the PowerBuilder Dojo as one of the premier PowerBuilder sites worldwide.    At first, the programmer will find this book a comprehensive guide to the wide scope of these libraries. Later it will serve as a handy memory tool for finding exactly what is needed at implementation time.    The manager will find this book an invaluable source for understanding which tools are available for immediate implementation.    PFC Programmers' Reference Manual covers PowerBuilder version 6 as well as version 5",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '8ebf4566-4743-455e-bbbe-a3f45bc2f268',
    "Graphics File Formats",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/brown.jpg",
    "133034054",
    30,
    30,
    484,
    'db294c60-9c7b-41f4-a894-d5debf81d8c3',
    "Graphics File Formats is a comprehensive guide to the file formats used in computer graphics and related areas. It discusses implementation and design of file formats in a readable style focusing on the basic issues important for the evaluation or development of file formats, including  data types  design goals  color  data organization  data encoding  data compression  classification  and conversion  The second part of the book provides summaries of over 50 graphics file formats in commercial use, such as CGM, DDES, FITS, MPEG, PICT, PostScript, TIFF, QuickTime, RIB, SunRaster, and X bitmap. Following a uniform organization, these summaries are handy reference sources for those needing basic information on these formats.    Written by two computer experts, this book is intended for graphics professionals, programmers and all those in commercial, engineering and scientific applications areas who need to make decisions related to file formats from graphical data.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '1e97f78b-6cc3-4eee-86a3-e79280f64d47',
    "Visual Object Oriented Programming",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/burnett.jpg",
    "131723979",
    10,
    10,
    280,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "This first book on the union of two rapidly growing approaches to programming--visual programming and object technology--provides a window on a subject of increasing commercial importance. It is an introduction and reference for cutting-edge developers, and for researchers, students, and enthusiasts interested in the design of visual OOP languages and environments.  Visual Object-Oriented Programming includes chapters on both emerging research and on a few classic systems, that together can help those who design visual object-oriented programming systems avoid some known pitfalls. The book contains an experience report on the use of available visual programming languages in a commercial setting, and chapters, by some of the leaders of this cutting-edge subject, covering systems such as Prograph, VIPR, PURSUIT, ThingLab II, Vampire, Forms/3, Self's environment, Vista, SPE, and Cerno.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '99321abd-7d13-4c88-a0ae-9de45a7e42d8',
    "iOS in Practice",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/cahill.jpg",
    "1617291269",
    24,
    24,
    325,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'db1e1830-7298-4c16-bbe4-1a63a7d094d3',
    "iPhone in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/callen.jpg",
    "193398886X",
    36,
    36,
    472,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "There is not another iPhone title that does such a great coverage of both Web and SDK topics under one roof, thus providing a well-rounded developer education.       Vladimir Pasman, Cocoacast.com",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'bd76fa55-2232-455f-b2ae-b03ba20afc6c',
    "Silverlight 2 in Action",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/campbell.jpg",
    "1933988428",
    46,
    46,
    400,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "Silverlight 2 in Action gives you a solid, well-thought out and coherent foundation for building RIA web applications, and provides you with lots of technical details without ever becoming cloudy.       Golo Roden, author, trainer and speaker for .NET technologies",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '841ed039-dc35-4faf-9b57-44709c2b2281',
    "The Quick Python Book, Second Edition",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ceder.jpg",
    "193518220X",
    19,
    19,
    360,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "This revision of Manning's popular The Quick Python Book offers a clear, crisp introduction to the elegant Python programming language and its famously easy-to-read syntax. Written for programmers new to Python, this updated edition covers features common to other languages concisely, while introducing Python's comprehensive standard functions library and unique features in detail.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    'a24bfe92-349e-4089-96e0-75989f930d28',
    "Internet and Intranet Applications with PowerBuilder 6",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/cervenka.jpg",
    "1884777600",
    27,
    27,
    390,
    '3ec974de-8363-43c7-a528-298d9ca7ff37',
    "If you're a PowerBuilder programmer, Internet and Intranet Applications with PowerBuilder 6 is your ticket to learning Web.PB and related technologies. The book covers everything you need to know to build web browser and server programs with the PowerBuilder 6 Internet Toolkit. Also covered is how to write winsock programs with PB, and Distributed PB is covered to the extent necessary to learn Web.PB.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);
INSERT INTO books (id, title, thumbnailUrl, isbn, quantity, availableCopies, pageCount, publisherId, description, status, createdAt, updatedAt) VALUES (
    '2772b67c-5593-414f-9c3f-ff70668d3f18',
    "Practical Methods for Your Year 2000 Problem",
    "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/cervenka.jpg",
    "188477752X",
    11,
    11,
    236,
    '607fd6b2-32a0-4572-bd38-b64ee0a61b3b',
    "Practical Methods for Your Year 2000 Problem gives the Year 2000 project team a step-by-step methodology for addressing the Year 2000 problem.",
    'available',
    '2025-08-05 08:01:08',
    '2025-08-05 08:01:08'
);