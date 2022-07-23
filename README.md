# proton

A declarative programming language used create wireframes and prototypes of user interfaces.

## Examples

This snippet creates a basic user interface

```proton
frame mobile {
    home: LandingPage(),
    size: 9/16,
    background: #fff,
}

component LandingPage() {
    children: [
        Headline (
            title: "Welcome to proton"
            subtitle: "Let's get started"
        ),
        Text("This is a proton example"),
        Button(
            text: "Sign Up"
            link: SignUpPage()
        )
    ]
}

component SignUpPage() {
    children: [
        Headline (
            title: "Sign Up"
            subtitle: "Let's get started"
        ),
        Text("Sign up"),
        Box(
            background: #fff
            height: 200px
        )
    ]
}

component Headline (title, subtitle) {
    children: [
        Text(text: title, size: 2, weight: bold),
        Text(text: subtitle, size: 1)
    ]
}

component Button (text, link) {
    children: [
        Text(text: text, size: 1)
    ]
    styles: {
        background: #fff
        border-radius: 4px
        padding: 8px 16px
        cursor: pointer
    }
    events: {
        click: navigateTo(link)
    }
}
```

Primitive components

-   Text
-   Box
-   Ellipsis
-   Image
-   Columns (flexbox)
