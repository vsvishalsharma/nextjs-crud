import "@testing-library/jest-dom"; // This import fixes the TypeScript errors
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderItemEditForm from "@/components/orders/order-items/order-item-edit-form"; // Adjust path as needed
import { updateOrderItem, validateOrderTotalPrice } from "@/lib/order-items/actions";
import { useToast } from "@/hooks/use-toast";

// Mock the external dependencies
jest.mock("@/lib/order-items/actions", () => ({
  updateOrderItem: jest.fn(),
  validateOrderTotalPrice: jest.fn()
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn()
}));

// Sample order item data for testing
const mockOrderItem = {
  id: "123",
  item_name: "Test Item",
  quantity: 5,
  barcode: "123456789",
  unit: "pcs",
  price: 10.99,
  order_id: "order123",
  product_id: "product123"
};

const mockToast = jest.fn();

describe("OrderItemEditForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (updateOrderItem as jest.Mock).mockResolvedValue(undefined);
    (validateOrderTotalPrice as jest.Mock).mockResolvedValue(undefined);
  });

 

  test("quantity field can be edited", async () => {
    const onCloseMock = jest.fn();
    render(<OrderItemEditForm onClose={onCloseMock} order_item={mockOrderItem} />);

    const quantityInput = screen.getByLabelText(/quantity/i);
    expect(quantityInput).not.toHaveAttribute("readOnly");

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "10");
    
    expect(quantityInput).toHaveValue(10);
  });

  test("submits form with updated data", async () => {
    const onCloseMock = jest.fn();
    render(<OrderItemEditForm onClose={onCloseMock} order_item={mockOrderItem} />);

    const quantityInput = screen.getByLabelText(/quantity/i);
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "10");
    
    const submitButton = screen.getByRole("button", { name: /edit order item/i });
    await userEvent.click(submitButton);

    // Check that the update function was called with the correct data
    await waitFor(() => {
      expect(updateOrderItem).toHaveBeenCalledWith({
        ...mockOrderItem,
        quantity: 10
      });
    });

    // Check that validateOrderTotalPrice was called
    expect(validateOrderTotalPrice).toHaveBeenCalledWith(mockOrderItem.order_id);
    
    // Check that toast was shown
    expect(mockToast).toHaveBeenCalledWith({
      title: "Order Item Edited",
      description: `You edited ${mockOrderItem.item_name}`,
    });

    // Check that onClose was called
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("handles submission error", async () => {
    const error = new Error("Update failed");
    (updateOrderItem as jest.Mock).mockRejectedValue(error);
    
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const onCloseMock = jest.fn();
    
    render(<OrderItemEditForm onClose={onCloseMock} order_item={mockOrderItem} />);

    const submitButton = screen.getByRole("button", { name: /edit order item/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to create product", error);
    });
    
    // onClose should not be called if there's an error
    expect(onCloseMock).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test("button is disabled during submission", async () => {
    // Add a delay to the updateOrderItem function to simulate a network request
    (updateOrderItem as jest.Mock).mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(undefined), 100);
    }));

    const onCloseMock = jest.fn();
    render(<OrderItemEditForm onClose={onCloseMock} order_item={mockOrderItem} />);

    const submitButton = screen.getByRole("button", { name: /edit order item/i });
    await userEvent.click(submitButton);

    // Check that the button is disabled during submission
    expect(submitButton).toBeDisabled();

    // Wait for the submission to complete
    await waitFor(() => {
      expect(updateOrderItem).toHaveBeenCalled();
    });
  });
});