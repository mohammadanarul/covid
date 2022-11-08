import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getCoupon } from '../api/checkout'

const useTotal = (cart, vouchar) => {
  const [subTotal, setSubTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')

  const makesubTotal = () => {
    let subtotal = 0
    cart?.map(item => {
      subtotal += item.quentity * item.price
      return subtotal
    })
    setSubTotal(subtotal)
  }

  const { isInitialLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ['checkDiscount', vouchar],
    queryFn: () => getCoupon(vouchar),
    enabled: false,
    onSuccess: data => {
      let date1 = new Date()

      if (date1.toISOString() <= data[0].attributes.validity) {
        let discount = (subTotal * parseInt(data[0].attributes.value)) / 100
        console.log(discount)
        setDiscount(discount)
      } else {
        setError('Coupon is Expired')
      }
    },
    onError: error => {
      console.log(error)
      setError(error.message)
    }
  })

  const makeTotal = () => {
    console.log(subTotal)
    if (discount == 0) {
      setTotal(subTotal)
    } else {
      setTotal(subTotal - discount)
    }
  }

  return {
    refetch,
    discount,
    subTotal,
    total,
    makesubTotal,
    makeTotal
  }
}

export default useTotal
