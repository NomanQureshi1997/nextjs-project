import { GlobeAltIcon } from "@heroicons/react/24/outline";


const languageOptions = [
    {
        value: "default",
        label: "Default",
        icon:  `https://img.icons8.com/?size=512&id=3685&format=png`
    },
    {
      value: "en-US",
      label: "English",
      icon: "https://flagsapi.com/US/shiny/64.png",
    },
    {
      value: "ru-RU",
      label: "Russian",
      icon: "https://flagsapi.com/RU/shiny/64.png",
    },
    {
      value: "es-ES",
      label: "Spanish",
      icon: "https://flagsapi.com/ES/shiny/64.png",
    },
    {
      value: "fr-FR",
      label: "French",
      icon: "https://flagsapi.com/FR/shiny/64.png",
    },
    {
      value: "de-DE",
      label: "German",
      icon: "https://flagsapi.com/DE/shiny/64.png",
    },
    {
      value: "it-IT",
      label: "Italian",
      icon: "https://flagsapi.com/IT/shiny/64.png",
    },
    {
      value: "pt-PT",
      label: "Portuguese",
      icon: "https://flagsapi.com/PT/shiny/64.png",
    },
    {
      value: "ja-JP",
      label: "Japanese",
      icon: "https://flagsapi.com/JP/shiny/64.png",
    },
    {
      value: "ko-KR",
      label: "Korean",
      icon: "https://flagsapi.com/KR/shiny/64.png",
    },
    {
      value: "zh-CN",
      label: "Chinese",
      icon: "https://flagsapi.com/CN/shiny/64.png",
    },
    {
      value: "ar-SA",
      label: "Arabic",
      icon: "https://flagsapi.com/SA/shiny/64.png",
    },
    {
      value: "hi-IN",
      label: "Hindi",
      icon: "https://flagsapi.com/IN/shiny/64.png",
    },
    {
      value: "af-ZA",
      label: "Afrikaans",
      icon: "https://flagsapi.com/ZA/shiny/64.png",
    },
    {
      value: "sq-AL",
      label: "Albanian",
      icon: "https://flagsapi.com/AL/shiny/64.png",
    },
    {
      value: "am-ET",
      label: "Amharic",
      icon: "https://flagsapi.com/ET/shiny/64.png",
    },
    {
      value: "hy-AM",
      label: "Armenian",
      icon: "https://flagsapi.com/AM/shiny/64.png",
    },
    {
      value: "az-AZ",
      label: "Azerbaijani",
      icon: "https://flagsapi.com/AZ/shiny/64.png",
    },
    {
      value: "eu-ES",
      label: "Basque",
      icon: "https://flagsapi.com/ES/shiny/64.png",
    },
    {
      value: "be-BY",
      label: "Belarusian",
      icon: "https://flagsapi.com/BY/shiny/64.png",
    },
    {
      value: "bn-BD",
      label: "Bengali",
      icon: "https://flagsapi.com/BD/shiny/64.png",
    },
    {
      value: "bs-BA",
      label: "Bosnian",
      icon: "https://flagsapi.com/BA/shiny/64.png",
    },
    {
      value: "bg-BG",
      label: "Bulgarian",
      icon: "https://flagsapi.com/BG/shiny/64.png",
    },
    {
      value: "my-MM",
      label: "Burmese",
      icon: "https://flagsapi.com/MM/shiny/64.png",
    },
    {
      value: "ca-ES",
      label: "Catalan",
      icon: "https://flagsapi.com/ES/shiny/64.png",
    },
    {
      value: "ceb-PH",
      label: "Cebuano",
      icon: "https://flagsapi.com/PH/shiny/64.png",
    },
    {
      value: "ny-MW",
      label: "Chichewa",
      icon: "https://flagsapi.com/MW/shiny/64.png",
    },
    {
      value: "hr-HR",
      label: "Croatian",
      icon: "https://flagsapi.com/HR/shiny/64.png",
    },
    {
      value: "cs-CZ",
      label: "Czech",
      icon: "https://flagsapi.com/CZ/shiny/64.png",
    },
    {
      value: "da-DK",
      label: "Danish",
      icon: "https://flagsapi.com/DK/shiny/64.png",
    },
    {
      value: "nl-NL",
      label: "Dutch",
      icon: "https://flagsapi.com/NL/shiny/64.png",
    },
    {
      value: "et-EE",
      label: "Estonian",
      icon: "https://flagsapi.com/EE/shiny/64.png",
    },
    {
      value: "tl-PH",
      label: "Filipino",
      icon: "https://flagsapi.com/PH/shiny/64.png",
    },
    {
      value: "fi-FI",
      label: "Finnish",
      icon: "https://flagsapi.com/FI/shiny/64.png",
    },
    {
      value: "ka-GE",
      label: "Georgian",
      icon: "https://flagsapi.com/GE/shiny/64.png",
    },
    {
      value: "el-GR",
      label: "Greek",
      icon: "https://flagsapi.com/GR/shiny/64.png",
    },
    {
      value: "gu-IN",
      label: "Gujarati",
      icon: "https://flagsapi.com/IN/shiny/64.png",
    },
    {
      value: "ht-HT",
      label: "Haitian Creole",
      icon: "https://flagsapi.com/HT/shiny/64.png",
    },
    {
      value: "ha-NG",
      label: "Hausa",
      icon: "https://flagsapi.com/NG/shiny/64.png",
    },
    {
      value: "iw-IL",
      label: "Hebrew",
      icon: "https://flagsapi.com/IL/shiny/64.png",
    },
    {
      value: "hu-HU",
      label: "Hungarian",
      icon: "https://flagsapi.com/HU/shiny/64.png",
    },
    {
      value: "is-IS",
      label: "Icelandic",
      icon: "https://flagsapi.com/IS/shiny/64.png",
    },
    {
      value: "ig-NG",
      label: "Igbo",
      icon: "https://flagsapi.com/NG/shiny/64.png",
    },
    {
      value: "id-ID",
      label: "Indonesian",
      icon: "https://flagsapi.com/ID/shiny/64.png",
    },
    {
      value: "ga-IE",
      label: "Irish",
      icon: "https://flagsapi.com/IE/shiny/64.png",
    },
    {
      value: "jv-ID",
      label: "Javanese",
      icon: "https://flagsapi.com/ID/shiny/64.png",
    },
    {
      value: "kn-IN",
      label: "Kannada",
      icon: "https://flagsapi.com/IN/shiny/64.png",
    },
    {
      value: "kk-KZ",
      label: "Kazakh",
      icon: "https://flagsapi.com/KZ/shiny/64.png",
    },
    {
      value: "km-KH",
      label: "Khmer",
      icon: "https://flagsapi.com/KH/shiny/64.png",
    },
    {
      value: "rw-RW",
      label: "Kinyarwanda",
      icon: "https://flagsapi.com/RW/shiny/64.png",
    },
    {
      value: "ky-KG",
      label: "Kyrgyz",
      icon: "https://flagsapi.com/KG/shiny/64.png",
    },
    { value: "lo-LA", label: "Lao", icon: "https://flagsapi.com/LA/shiny/64.png" },
    {
      value: "lv-LV",
      label: "Latvian",
      icon: "https://flagsapi.com/LV/shiny/64.png",
    },
    {
      value: "lt-LT",
      label: "Lithuanian",
      icon: "https://flagsapi.com/LT/shiny/64.png",
    },
    {
      value: "mk-MK",
      label: "Macedonian",
      icon: "https://flagsapi.com/MK/shiny/64.png",
    },
    {
      value: "mg-MG",
      label: "Malagasy",
      icon: "https://flagsapi.com/MG/shiny/64.png",
    },
    {
      value: "ms-MY",
      label: "Malay",
      icon: "https://flagsapi.com/MY/shiny/64.png",
    },
  
    // add more languages here...
  ];


export default languageOptions;