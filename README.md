# Extract i18n

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Extract characters, translate and generate i18n file

# Usage

`shift + command/ctrl + p` to search command

# Commands

> Red <span style="color:red">content</span> is selection content
> Green <span style="color: green">replaced</span> is replaced content

## Extract Text

Replace only the selected string (automatically includes the immediate quotation marks)

- &lt;div&gt;<span style="color: red">Dashboard Title</span>&lt;/div&gt;
  - &lt;div&gt;<span style="color: green">t("extract-i18n.dashboardTitle")</span>&lt;/div&gt;
- &lt;div&gt;<span style="color: red">"Dashboard Title"</span>&lt;/div&gt;
  - &lt;div&gt;<span style="color: green">t("extract-i18n.dashboardTitle")</span>&lt;/div&gt;
- &lt;div&gt;<span style="color: red">'Dashboard Title'</span>&lt;/div&gt;
  - &lt;div&gt;<span style="color: green">t("extract-i18n.dashboardTitle)</span>&lt;/div&gt;

## Extract Text With Auto Brace Wrapper

Replace the selected string (automatically includes the immediate quotation marks) and auto wrapper the `{}`

- &lt;div&gt;<span style="color: red">Dashboard Title</span>&lt;/div&gt;
  - &lt;div&gt;<span style="color: green">{t("extract-i18n.dashboardTitle")}</span>&lt;/div&gt;
- &lt;div&gt;{<span style="color: red">"Dashboard Title"</span>}&lt;/div&gt;
  - &lt;div&gt;{<span style="color: green">t("extract-i18n.dashboardTitle")</span>}&lt;/div&gt;
- &lt;div&gt;<span style="color: red">"Dashboard Title"</span>&lt;/div&gt;
  - &lt;div&gt;<span style="color: green">{t("extract-i18n.dashboardTitle")}</span>&lt;/div&gt;
- &lt;div&gt;<span style="color: red">'Dashboard Title'</span>&lt;/div&gt;
  - &lt;div&gt;<span style="color: green">{t("extract-i18n.dashboardTitle)}</span>&lt;/div&gt;
- &lt;div title="<span style="color: red">Dashboard Title</span>" /&gt;
  - &lt;div title=<span style="color: green">{t("extract-i18n.dashboardTitle)}</span> /&gt;

## Extract Modify Prefix:

Modify the key prefix

This is default replace content:

```
t("<span style="color: red">extract-i18n</span>.dashboardTitle)
```

Modify default value `extract-i18n` -> `dashboards`

The new replacement will look like this:

```
t("<span style="color: green">dashboards</span>.dashboardTitle)
```

## Extract Modify Target

The specified JSON file is generated in the nearest Locales directory,

eg: ["en","zh"] -> **/locales/en.json, **/locales/zh.json

## Extract Modify langsMap

The target's value (`zh`) maybe is not a keyword for translate api, it should be `zh-CN`

## Extract Modify Template

default value: `t("{{key}}")`
