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
        Button (
            text: "Sign Up"
            link: SignunPage()
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
        border: 1px solid #ccc
        border-radius: 4px
        padding: 8px 16px
        cursor: pointer
    }
    events: {
        onClick: () -> FRAME.navigateTo(link)
    }
}
```

Primitive components

* Text
* Box
* Ellipsis
* Image
* Columns (flexbox)