<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="#" class="logo">Nyumba<span>360</span></a>
          <p>
            A simple property management solution built for Kenyan landlords and property managers.
          </p>
          <div class="footer-developer">
            Developed by
            <strong> <a href="https://wajuaji.digital" target="_blank">Wajuaji Digital</a></strong
            ><br />Nairobi, Kenya
          </div>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#listings">Find a Home</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#">Download</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 Nyumba360. All rights reserved.</p>
        <button class="back-to-top" @click="scrollToTop" aria-label="Back to top">
          <span class="btt-arrow">↑</span>
          Back to top
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
footer {
  background: var(--landing-dark-azure);
  color: #fff;
  padding: 64px 24px 32px;
}
.footer-inner {
  max-width: 1160px;
  margin: 0 auto;
}
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
}
.footer-brand .logo {
  color: #fff;
  font-size: 1.4rem;
  display: block;
  margin-bottom: 12px;
  font-family: 'Playfair Display', serif;
  text-decoration: none;
  letter-spacing: -0.5px;
}
.footer-brand .logo span {
  color: #7ecad8;
}
.footer-brand p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  max-width: 260px;
  margin-bottom: 20px;
}
.footer-developer {
  font-size: 0.8rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.45);
}
.footer-developer strong a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.75);
}
.footer-col h4 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}
.footer-col ul {
  list-style: none;
}
.footer-col li {
  margin-bottom: 10px;
}
.footer-col a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.92rem;
  transition: color 0.2s;
}
.footer-col a:hover {
  color: #fff;
}

/* ── Footer bottom ── */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-bottom p {
  font-size: 0.83rem;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Back to top ── */
.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 0.35rem 0.9rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    transform 0.2s;
}

.back-to-top:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}

.back-to-top:hover .btt-arrow {
  transform: translateY(-2px);
}

.btt-arrow {
  display: inline-block;
  transition: transform 0.2s;
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 600px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
