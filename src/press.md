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
<h4><a href="{{ article.url }}">{{ article.publication }} | {{ article.title }}</a></h4>
<p>{{ article.description }}</p>
</section>
{% endfor %}
