import { getCountries } from "@/app/_lib/data-service";

async function SelectCountry({ id, name, defaultcountry, className }) {
  const countries = await getCountries();
  //   console.log(countries);
  //   console.log(countries.map((c) => c.name.common));
  const flag =
    countries.find((country) => country.name === defaultcountry)?.flag ?? "";
  //   console.log(flag);

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultcountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name.common} value={`${c.name.common}%${c.flag}`}>
          {c.name.common}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
