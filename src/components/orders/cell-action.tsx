'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderDataType } from "@/lib/order-data";
import { useRouter } from "next/navigation";
import { DeleteModal } from "../modal/orders/delete-modal";
import { useState } from "react";
import { useDebounceCallback } from 'usehooks-ts';

interface CellActionProps {
  order: OrderDataType
}

export default function CellAction({ order }: CellActionProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleClick = useDebounceCallback((e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      router.push(`/orders/edit/${order.id}`)
  }, 300);

  return (
    <>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose = {() => setIsDeleteModalOpen(false)}
        order={order}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(order.customer_name)}
          >
            Copy product name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClick}>
            View order details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
            Delete order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}