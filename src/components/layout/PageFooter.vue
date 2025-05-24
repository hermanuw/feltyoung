<template>
  <div class="bg-black text-white p-4 md:p-20 py-10">
    <div>
      <div class="flex flex-col md:flex-row gap-10 justify-between">
        <div class="md:w-1/5 space-y-6">
          <h1 class="uppercase text-xl font-bold cursor-pointer">
            <span class="text-white">Feltyoung</span>
            <span class="text-[#5C4033]">.kicks</span>
          </h1>
          <p class="text-gray-200 text-base">
            ORIGINAL 100%. <br>
            <!-- - <br> -->
            Well Sell & Trusted <br>
            Since 2019 <br>
            <!-- - <br> -->
            Shop Online 24/7 <br>
          </p>
          <div class="flex items-center justify-between w-1/2 text-2xl">
            <a href="https://wa.me/6289614307299" target="_blank" rel="noopener noreferrer">
              <AkWhatsappFill class="hover:text-[#5C4033] transition" />
            </a>
            <a href="mailto:dofanmars@gmail.com" target="_blank" rel="noopener noreferrer">
              <SiGmail class="hover:text-[#5C4033] transition" />
            </a>
            <a href="https://www.instagram.com/feltyoung.kicks/" target="_blank" rel="noopener noreferrer">
              <BsInstagram class="hover:text-[#5C4033] transition" />
            </a>
          </div>

        </div>
        <!-- <FooterLinks :title="'Information'" :links="informationLinks" />
        <FooterLinks
          :title="'Customer Support'"
          :links="customerSupportLinks"
        /> -->
        <div class="md:w-1/5">
          <h2 class="text-xl font-semibold mb-2">Have a Questions?</h2>
          <div class="flex flex-col space-y-4 mt-6">
            <div
              v-for="(info, index) in contactInfo"
              :key="index"
              class="flex items-start space-x-4"
            >
              <div>
                <component :is="info.icon" class="text-md text-white" />
              </div>
              <p class="text-gray-200 text-md">{{ info.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="text-gray-200 text-md text-center mt-16">
          Feltyoung.kicks ©2025
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BsInstagram,
  SiGmail,
  AkWhatsappFill,
  AkLocation,
  AnOutlinedMail,
  BsTelephoneFill,
} from "@kalimahapps/vue-icons";
import FooterLinks from "../composables/FooterLinks.vue";

const informationLinks = [
  "About",
  "Services",
  "Terms and Conditions",
  "Best Price",
  "Guarantee",
  "Privacy & Cookies Policy",
];

const customerSupportLinks = [
  "FAQ",
  "Payment Option",
  "Booking Tips",
  "How it Works",
  "Contact Us",
];

const contactInfo = [
  {
    icon: AkLocation,
    text: "Depok, Indonesia",
  },
  { icon: AnOutlinedMail, text: "feltyoung.kicks@gmail.com" },
  { icon: BsTelephoneFill, text: "+62-896-1430-7299"},
];
</script>

<style></style>
