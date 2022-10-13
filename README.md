# Extract i18n

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Extract characters, translate and generate i18n file

# Usage

`shift + command/ctrl + p` to search command

# Setting

## translateEngine.customEngine

If you want to use the custom requesting to translate, you must define the `customEngine` config

The `customEngine` data structure like blow:

```
{
  url: 'http://fanyi.youdao.com/openapi.do?keyfrom=123aab&key=cccdfdf&type=data&doctype=json&version=1.1&q=<text>',
  path: 'translation[0]'
}

// The values in Angle brackets defined above will be matched to the following data that is passed by program.
{
  text: 'Hello world',
  from: 'zh',
  to: 'en'
}
```

# Commands

> `content` is selection content

## Extract Text

Replace only the selected string (automatically includes the immediate quotation marks)

- &lt;div&gt;`Dashboard Title`&lt;/div&gt;
  - &lt;div&gt;`t("extract-i18n.dashboardTitle")`&lt;/div&gt;
- &lt;div&gt;`"Dashboard Title"`&lt;/div&gt;
  - &lt;div&gt;`t("extract-i18n.dashboardTitle")`&lt;/div&gt;
- &lt;div&gt;`'Dashboard Title'`&lt;/div&gt;
  - &lt;div&gt;`t("extract-i18n.dashboardTitle)`&lt;/div&gt;

## Extract Text With Auto Brace Wrapper

Replace the selected string (automatically includes the immediate quotation marks) and auto wrapper the `{}`

- &lt;div&gt;`Dashboard Title`&lt;/div&gt;
  - &lt;div&gt;`{t("extract-i18n.dashboardTitle")}`&lt;/div&gt;
- &lt;div&gt;{`"Dashboard Title"`}&lt;/div&gt;
  - &lt;div&gt;{`t("extract-i18n.dashboardTitle")`}&lt;/div&gt;
- &lt;div&gt;`"Dashboard Title"`&lt;/div&gt;
  - &lt;div&gt;`{t("extract-i18n.dashboardTitle")}`&lt;/div&gt;
- &lt;div&gt;`'Dashboard Title'`&lt;/div&gt;
  - &lt;div&gt;`{t("extract-i18n.dashboardTitle)}`&lt;/div&gt;
- &lt;div title="`Dashboard Title`" /&gt;
  - &lt;div title=`{t("extract-i18n.dashboardTitle)}` /&gt;

## Extract Modify Prefix:

Modify the key prefix

This is default replace content:

```
t("extract-i18n.dashboardTitle)
```

Modify default value `extract-i18n` -> `dashboards`

The new replacement will look like this:

```
t("dashboards.dashboardTitle)
```

## Extract Modify Target

The specified JSON file is generated in the nearest Locales directory,

eg: ["en","zh"] -> **/locales/en.json, **/locales/zh.json

## Extract Modify langsMap

The target's value (`zh`) maybe is not a keyword for translate api, it should be `zh-CN`

## Extract Modify Template

default value: `t("{{key}}")`
