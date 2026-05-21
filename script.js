const app = Vue.createApp({
  data() {
    return {
      form: {
        fullName: "",
        dob: "",
        gender: "",
        totalVisitors: "",
        children: "",
        accommodation: "",
        cardholderName: "",
        cardNumber: "",
        expirationDate: "",
        cvv: ""
      },

      errors: {},

      generalError: "",

      places: [],

      isLoadingPlaces: false,

      placesError: "",

      selectedPlaces: [],

      accommodationOptions: [
        "No accommodation needed",
        "Forest View Hotel",
        "Totoro Family Inn",
        "Witch Valley Guesthouse",
        "Luxury Ghibli Resort"
      ],

      showSummary: false
    };
  },

  mounted() {
    this.loadPlaces();
  },

  methods: {
    async loadPlaces() {
      this.isLoadingPlaces = true;
      this.placesError = "";

      try {
        const response = await fetch("ghibli_park.json");

        if (!response.ok) {
          throw new Error("JSON file could not be loaded.");
        }

        const data = await response.json();
        this.places = data;
      } catch (error) {
        this.placesError = "There was a problem loading the Ghibli Park places.";
      }

      this.isLoadingPlaces = false;
    },

    togglePlace(place) {
      const index = this.selectedPlaces.findIndex(function(item) {
        return item.id === place.id;
      });

      if (index === -1) {
        this.selectedPlaces.push(place);
      } else {
        this.selectedPlaces.splice(index, 1);
      }

      this.showSummary = false;
    },

    isSelected(place) {
      return this.selectedPlaces.some(function(item) {
        return item.id === place.id;
      });
    },

    generateItinerary() {
      this.clearErrors();

      const valid = this.validateForm();

      if (valid) {
        this.showSummary = true;
      } else {
        this.generalError =
          "There are mandatory items pending to be filled. Please complete the required fields.";
        this.showSummary = false;
      }
    },

    validateForm() {
      let valid = true;

      if (this.form.fullName === "") {
        this.errors.fullName = "Full name is required.";
        valid = false;
      }

      if (this.form.dob === "") {
        this.errors.dob = "Date of birth is required.";
        valid = false;
      }

      if (this.form.gender === "") {
        this.errors.gender = "Gender is required.";
        valid = false;
      }

      if (this.selectedPlaces.length === 0) {
        this.errors.selectedPlaces = "Please select at least one Ghibli Park place.";
        valid = false;
      }

      if (this.form.totalVisitors === "") {
        this.errors.totalVisitors = "Total number of visitors is required.";
        valid = false;
      } else if (Number(this.form.totalVisitors) < 1) {
        this.errors.totalVisitors = "Total number of visitors must be at least 1.";
        valid = false;
      }

      if (this.form.children === "") {
        this.errors.children = "Number of children is required.";
        valid = false;
      } else if (Number(this.form.children) < 0) {
        this.errors.children = "Number of children cannot be negative.";
        valid = false;
      } else if (
        this.form.totalVisitors !== "" &&
        Number(this.form.children) > Number(this.form.totalVisitors)
      ) {
        this.errors.children = "Number of children cannot be more than total visitors.";
        valid = false;
      }

      if (this.form.accommodation === "") {
        this.errors.accommodation = "Please select an accommodation option.";
        valid = false;
      }

      if (this.form.cardholderName === "") {
        this.errors.cardholderName = "Cardholder name is required.";
        valid = false;
      }

      if (this.form.cardNumber === "") {
        this.errors.cardNumber = "Card number is required.";
        valid = false;
      }

      if (this.form.expirationDate === "") {
        this.errors.expirationDate = "Expiration date is required.";
        valid = false;
      }

      if (this.form.cvv === "") {
        this.errors.cvv = "CVV is required.";
        valid = false;
      }

      return valid;
    },

    clearErrors() {
      this.errors = {};
      this.generalError = "";
      this.showSummary = false;
    }
  }
});

app.mount("#app");  
