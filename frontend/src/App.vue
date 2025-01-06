<template>
  <div>
    <h1>Upload une vidéo pour générer des sous-titres</h1>
    <input type="file" @change="onFileChange" />
    <button @click="uploadFile">Télécharger</button>
    <div v-if="uploading">
      <p>Temps restant estimé: {{ remainingTimeFormatted }}</p>
      <progress :value="progress" max="100"></progress>
    </div>
    <div v-if="subtitlesUrl">
      <h2>Sous-titres générés</h2>
      <a :href="backUrl + subtitlesUrl" download>Télécharger les sous-titres</a>
      <br>
      <a :href="backUrl + videoUrl" download>Télécharger la vidéo sous-titrée</a>
    </div>

    <div v-if="transcription">
      <h2>Transcription:</h2>
      <p>{{ transcription }}</p>
    </div>

    <div v-if="videoUrl">
      <h2>Vidéo sous-titrée</h2>
      <video :src="backUrl + videoUrl" controls width="600"></video>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      backUrl: "http://localhost:5000",
      subtitlesUrl: null,
      transcription: null,
      videoUrl: null,
      file: null,
      uploading: false,
      progress: 0,
      remainingTime: 0,
      result: null,
    };
  },
  computed: {
    remainingTimeFormatted() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = Math.floor(this.remainingTime % 60);
      return `${minutes}m ${seconds}s`;
    },
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    uploadFile() {
      if (!this.file) return;

      this.uploading = true;
      this.progress = 0;

      const estimatedTime = this.file.size / 1200000; // Estimation du temps restant en secondes
      this.remainingTime = estimatedTime; // Estimation du temps restant en secondes

      const formData = new FormData();
      formData.append('file', this.file);

      const interval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.progress = ((estimatedTime - this.remainingTime) / estimatedTime) * 100;
        } else {
          clearInterval(interval);
        }
      }, 1000);

      axios
          .post(`${this.backUrl}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.subtitlesUrl = response.data.subtitlesUrl;
            this.transcription = response.data.transcription; // Afficher la transcription
            this.videoUrl = response.data.videoUrl; // Afficher la vidéo sous-titrée
          })
          .catch((error) => {
            console.error("Erreur lors de l'upload de la vidéo : ", error);
          })
          .finally(() => {
            clearInterval(interval);
            this.uploading = false;
          });
    },
  },
};
</script>
