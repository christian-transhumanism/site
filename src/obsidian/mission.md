---
title: Mission
description: Participating with God in the redemption, reconciliation, and renewal of the world.
layout: resourcePage
permalink: mission/
aliases:
  - CTA Mission
  - mission
---

# Our Three-Fold Mission

{% assign theologicalImage = '' %}
{% for c in conversations %}
  {% if c.url == '/mission/theological/' %}
    {% assign theologicalImage = c %}
  {% endif %}
{% endfor %}

{% assign faithImage = '' %}
{% for c in conversations %}
  {% if c.url == '/mission/faith/' %}
    {% assign faithImage = c %}
  {% endif %}
{% endfor %}

{% assign techImage = '' %}
{% for c in conversations %}
  {% if c.url == '/mission/technological/' %}
    {% assign techImage = c %}
  {% endif %}
{% endfor %}

<div class="mission-list">

  <div class="blog-post mission-post">
    <div class="row">
      <div class="col-md-4">
        <a class="post-image-link" href="/mission/theological/">
          <img
            src="{{ theologicalImage.image | cdnImage: 'c_scale,w_600,f_auto,q_auto,dpr_auto' }}"
            srcset="{{ theologicalImage.image | cdnImage: 'c_scale,w_320,f_auto,q_auto,dpr_auto' }} 320w, {{ theologicalImage.image | cdnImage: 'c_scale,w_600,f_auto,q_auto,dpr_auto' }} 600w, {{ theologicalImage.image | cdnImage: 'c_scale,w_900,f_auto,q_auto,dpr_auto' }} 900w"
            sizes="(max-width: 576px) 100vw, 33vw"
            alt="Theological mission"
            class="img-responsive post-image post-image--rect"
            loading="lazy">
        </a>
      </div>
      <div class="col-md-8">
        <h2><a href="/mission/theological/">Transformative Theology</a></h2>
        <p>In a world where Christians often see science and technology as enemies of faith---<b>We believe that science and technology are part of the mission of Christ and of God</b>. <i>We as a community need to be able to share this understanding of the Christian story.</i></p>
      </div>
    </div>
  </div>

  <div class="blog-post mission-post">
    <div class="row">
      <div class="col-md-4">
        <a class="post-image-link" href="/mission/technological/">
          <img
            src="{{ techImage.image | cdnImage: 'c_scale,w_600,f_auto,q_auto,dpr_auto' }}"
            srcset="{{ techImage.image | cdnImage: 'c_scale,w_320,f_auto,q_auto,dpr_auto' }} 320w, {{ techImage.image | cdnImage: 'c_scale,w_600,f_auto,q_auto,dpr_auto' }} 600w, {{ techImage.image | cdnImage: 'c_scale,w_900,f_auto,q_auto,dpr_auto' }} 900w"
            sizes="(max-width: 576px) 100vw, 33vw"
            alt="Technological mission"
            class="img-responsive post-image post-image--rect"
            loading="lazy">
        </a>
      </div>
      <div class="col-md-8">
        <h2><a href="/mission/technological/">Ethical Technology</a></h2>
        <p>In a world of increasingly difficult ethical questions and challenges---<b>We believe that Christ offers an ethical vision for scientific and technological progress</b>. <i>We as a community need to be able to articulate and advocate for that ethical vision, and to enact it progressively in our own lives, and in the world around us.</i></p>
      </div>
    </div>
  </div>

  <div class="blog-post mission-post">
    <div class="row">
      <div class="col-md-4">
        <a class="post-image-link" href="/mission/faith/">
          <img
            src="{{ faithImage.image | cdnImage: 'c_scale,w_600,f_auto,q_auto,dpr_auto' }}"
            srcset="{{ faithImage.image | cdnImage: 'c_scale,w_320,f_auto,q_auto,dpr_auto' }} 320w, {{ faithImage.image | cdnImage: 'c_scale,w_600,f_auto,q_auto,dpr_auto' }} 600w, {{ faithImage.image | cdnImage: 'c_scale,w_900,f_auto,q_auto,dpr_auto' }} 900w"
            sizes="(max-width: 576px) 100vw, 33vw"
            alt="Faith-renewing mission"
            class="img-responsive post-image post-image--rect"
            loading="lazy">
        </a>
      </div>
      <div class="col-md-8">
        <h2><a href="/mission/faith/">Renewed Faith</a></h2>
        <p>In a world of rising skepticism and disenchantment---<b>We believe that engaging the future can help faith come alive</b>. <i>We as a community need to be able to show how the future can renew our faith, and the faith of individuals, families, communities, and the world.</i></p>
      </div>
    </div>
  </div>


</div>

<br>

