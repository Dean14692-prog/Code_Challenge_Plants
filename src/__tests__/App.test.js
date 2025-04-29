import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "../components/App";

const mockPlants = [
  { id: 1, name: "Aloe", image: "aloe.jpg", price: 9.99, soldOut: false },
];

const mockNewPlant = {
  id: 2,
  name: "Rose",
  image: "rose.jpg",
  price: 10.99,
  soldOut: false,
};

beforeAll(() => {
  jest.spyOn(window, "fetch").mockImplementation((url, { method }) => {
    if (url === "http://localhost:6001/plants" && method !== "POST") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPlants),
      });
    }
    if (url === "http://localhost:6001/plants" && method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockNewPlant),
      });
    }
    return Promise.reject(new Error("Unknown URL"));
  });
});

afterEach(() => {
  window.fetch.mockClear();
});

afterAll(() => {
  window.fetch.mockRestore();
});

test("adds a new plant when the form is submitted", async () => {
  render(<App />);

  // Wait for initial plants to load
  await waitFor(() => {
    expect(screen.getByText("Aloe")).toBeInTheDocument();
  });

  // Fill out the form
  fireEvent.change(screen.getByPlaceholderText("Plant name"), {
    target: { value: "Rose" },
  });
  fireEvent.change(screen.getByPlaceholderText("Image URL"), {
    target: { value: "rose.jpg" },
  });
  fireEvent.change(screen.getByPlaceholderText("Price"), {
    target: { value: "10.99" },
  });

  // Submit the form
  fireEvent.click(screen.getByText("Add Plant"));

  // Verify the new plant appears
  await waitFor(() => {
    expect(screen.getByText("Rose")).toBeInTheDocument();
    expect(screen.getByText("Price: $10.99")).toBeInTheDocument(); // Match the full price string
  });
});

test("handles fetch error", async () => {
  window.fetch.mockImplementationOnce(() =>
    Promise.reject(new Error("Network error"))
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
