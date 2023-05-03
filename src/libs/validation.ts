export const EmailRule =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const AlphaRule = /[^a-zA-ZÀ-ÖØ-öø-ÿ\s\-]/;
export const AlphaNumRule = /[^a-zA-Z0-9À-ÖØ-öø-ÿ\s\-]/;
export const AlphaNumPlusRule = /[^a-zA-Z0-9À-ÖØ-öø-ÿ\s\-,."'#\/]/;
export const NumericRule = /[^0-9+-.]/;
export const PhoneRule = /[^0-9\s-+]/;
export const URLRule = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
