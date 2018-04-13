describe("Tests to determine IsAlreadyAdded(cityArrayObject, cityName) method", function() {
    
    it("Return true for valid city name", function() {
        expect(IsAlreadyAdded([{'city':'Bangalore'}, {'city':'Mysore'}], "Bangalore")).toBe(true);
    });
    
    it("Return false for invalid city name", function() {
        expect(IsAlreadyAdded([{'city':'Bangalore'}, {'city':'Mysore'}], "Chennai")).toBe(false);
    });
    
    it("Return false for empty city object", function() {
        expect(IsAlreadyAdded([], "Bangalore")).toBe(false);
    });
    
    it("Return false for empty city object and city", function() {
        expect(IsAlreadyAdded([], "")).toBe(false);
    });
    
    it("Return false for empty city", function() {
        expect(IsAlreadyAdded([{'city':'Bangalore'}, {'city':'Mysore'}], "")).toBe(false);
    });
    
    it("Return false for city null", function() {
        expect(IsAlreadyAdded([{'city':'Bangalore'}, {'city':'Mysore'}], null)).toBe(false);
    });
    
    it("Return false for city undefined", function() {
        expect(IsAlreadyAdded([{'city':'Bangalore'}, {'city':'Mysore'}], undefined)).toBe(false);
    });
    
    it("Return false for city object null", function() {
        expect(IsAlreadyAdded(null, "Bangalore")).toBe(false);
    });
    
    it("Return false for city object undefined", function() {
        expect(IsAlreadyAdded(undefined, "Bangalore")).toBe(false);
    });
    
});


describe("Tests to determine getDirection(wind) method", function() {
    
    it("Should return North for 357 degree", function() {
        expect(getDirection(357)).toBe("North");
    });
    
    it("Should return SouthEast for 125 degree", function() {
        expect(getDirection(125)).toBe("SouthEast");
    });
    
    it("Should return Invalid for -37.6 degree", function() {
        expect(getDirection(-37.6)).toBe("Invalid");
    });
    
    it("Should return Invalid for 377.6 degree", function() {
        expect(getDirection(377.6)).toBe("Invalid");
    });
    
    it("Should return Invalid for null wind value", function() {
        expect(getDirection(null)).toBe("Invalid");
    });
    
    it("Should return Invalid for undefined wind value", function() {
        expect(getDirection(undefined)).toBe("Invalid");
    });
    
    it("Should return West NorthWest for 289.999999999999999999999999999999999999999999999999999999999999999999 wind value", function() {
        expect(getDirection(289.999999999999999999999999999999999999999999999999999999999999999999)).toBe("West NorthWest");
    });
    
});

describe("Tests to determine GenerateQuickButtons(item) method", function() {
   
    it("Should return false for null cityData array object", function() {
       expect(GenerateQuickButtons(null)).toBe(false); 
    });
    
    it("Should return false for undefined cityData array object", function() {
       expect(GenerateQuickButtons(undefined)).toBe(false); 
    });
    
    it("Should return false for null cityData array object city name", function() {
       expect(GenerateQuickButtons({"city": null})).toBe(false); 
    });
    
    it("Should return false for undefined cityData array object city name", function() {
       expect(GenerateQuickButtons({"city": undefined})).toBe(false); 
    });
    
    it("Should return nothing for valid object input", function() {
       pending("Adds a button on runtime, so disabled for actual usage.");
       expect(GenerateQuickButtons({"city": "Bangalore"})).toBe(); 
    });
    
});