---
title: Press and Coverage
description: Interviews, press, coverage
layout: resourcePage
permalink: press/
---

# Press and Coverage

_Christian Transhumanism has been covered around the world. Here are some selected interviews, articles, and videos:_

{% for article in coverage %}
<section>
<b><a href="{{ article.url }}">{{ article.publication }} | {{ article.title }}</a></b>
<p><em>{{ article.date }}</em> {{ article.description }}</p>
</section>
{% endfor %}
