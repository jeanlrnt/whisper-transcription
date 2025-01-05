<template>
  <div>
    <h1>Upload une vidéo pour générer des sous-titres</h1>
    <form @submit.prevent="handleFileUpload">
      <input type="file" ref="fileInput" />
      <button type="submit">Télécharger</button>
    </form>

    <div v-if="subtitlesUrl">
      <h2>Sous-titres générés</h2>
      <a :href="backUrl + subtitlesUrl" download="subtitles.srt">Télécharger les sous-titres</a>
      <br>
      <a :href="backUrl + videoUrl" download="video.mp4">Télécharger la vidéo sous-titrée</a>
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
    };
  },
  methods: {
    handleFileUpload() {
      const formData = new FormData();
      formData.append("file", this.$refs.fileInput.files[0]);

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
          });
    },
  },
};
</script>
