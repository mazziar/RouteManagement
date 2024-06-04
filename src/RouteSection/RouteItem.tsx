import React, { FC, useEffect, useState } from "react";
import { RouteListType, RouteItemType } from '../schema/Utils'

type PropsType = {
  item: RouteItemType
  index: number
  unionWindow: number[]
  sumWindow: number
  draggedStep: number[]
  setDraggedStep: React.Dispatch<React.SetStateAction<number[]>>
  dropStep: number[]
  setDropStep: React.Dispatch<React.SetStateAction<number[]>>
  draggedRouteId: number
  setDraggedRouteId: React.Dispatch<React.SetStateAction<number>>
  dragOverRouteId: number
  setDragOverRouteId: React.Dispatch<React.SetStateAction<number>>
  removeService: () => void
  addService: (step: number[]) => void
  canDrop: boolean
  setCanDrop: React.Dispatch<React.SetStateAction<boolean>>
}
const dropAreaOff = 0

const RouteItem: FC<PropsType> = ({
  item,
  index,
  unionWindow,
  sumWindow,
  draggedStep,
  setDraggedStep,
  dropStep,
  setDropStep,
  draggedRouteId,
  setDraggedRouteId,
  dragOverRouteId,
  setDragOverRouteId,
  removeService,
  addService,
  canDrop,
  setCanDrop
}) => {
  const [mouseXLocation, setMouseXLocation] = useState(0)
  const [routeWidthPX, setRouteWidthPX] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const windowLength = item.window[1] - item.window[0]

  useEffect(() => {
    const target = document.getElementById('dropTarget' + index);
    const getOffset = target?.getBoundingClientRect().left

    setRouteWidthPX(((target?.clientWidth || 0)))
    getOffset && setOffsetLeft(getOffset)
  }, [draggedStep])

  const checkCanDrop = () => {

    setCanDrop(item.steps.map((step) =>
    (
      ((mouseXLocation - offsetLeft) * 100 / routeWidthPX) +
      (((draggedStep[1] - draggedStep[0]) / windowLength) * 100) <
      ((step[0] - item.window[0]) * 100 / windowLength) ||
      ((mouseXLocation - offsetLeft) * 100 / routeWidthPX) >
      ((step[0] - item.window[0]) * 100 / windowLength) +
      (((step[1] - step[0]) / windowLength) * 100) ||
      (dragOverRouteId === item.id && draggedStep[0] === step[0])
    )
    ).every(Boolean))

  }

  return <div style={{ width: '100%' }} className={`flex p-1 px-8 py-4 ${index % 2 ? 'bg-gray-200' : ''}`}>
    <div className="w-14">
      {index + 1}
    </div>

    <div className=" w-32">
      van232
    </div>

    <div className=" w-32">
      100%
    </div>
    <div className="relative flex-1">
      <div
        onDragOver={(e) => {
          setMouseXLocation(e.clientX);
          setDragOverRouteId(item.id);
          checkCanDrop()
          canDrop && setDropStep([
            item.window[0] +
            ((mouseXLocation - offsetLeft) / routeWidthPX) * windowLength
            ,
            (item.window[0] +
              ((mouseXLocation - offsetLeft) / routeWidthPX) * windowLength) +
            (draggedStep[1] - draggedStep[0])])
        }}
        id={'dropTarget' + index}
        style={{
          left: `${(item.window[0] - unionWindow[0]) * 100 / sumWindow}%`,
          width: `${windowLength * 100 / sumWindow}%`
        }}
        className="absolute">
        <div className="relative flex  content-center">
          <div className="-ml-8 rounded-lg border-2 border-neutral-400 text-gray-800 px-2 ">
            S
          </div>

          {item.steps.map((step, ind) =>
            <div key={ind + 'step'}
              draggable
              id={ind + 'service'}
              onDragStart={() => { setDraggedStep(step); setDraggedRouteId(() => item.id) }}
              onDragEnd={() => {

                canDrop && removeService();
                canDrop && addService(dropStep)
                setDragOverRouteId(0)
              }}
              style={{
                left: `${((step[0] - item.window[0]) * 100 / windowLength)}%`,
                width: `${(((step[1] - step[0]) * 100 / windowLength))}%`
              }}
              className={`absolute rounded-lg border-2
              ${index % 3 == 0 && ' bg-orange-500  border-orange-500'}
              ${index % 3 == 1 && 'bg-purple-500  border-purple-500'}
              ${index % 3 == 2 && 'bg-pink-500  border-pink-500'}
              text-gray-50 px-2 text-sm `}>
              {ind + 1}
            </div>
          )}
          {dragOverRouteId === item.id && dragOverRouteId !== 0 &&
            < div key={'frame'}
              style={{
                left: `${mouseXLocation < (offsetLeft + dropAreaOff) ? 0 :
                  mouseXLocation > offsetLeft + routeWidthPX - dropAreaOff ? 100 :
                    (mouseXLocation - offsetLeft) * 100 / routeWidthPX
                  }%`,
                width: `${((draggedStep[1] - draggedStep[0]) / windowLength) * 100}%`
              }}
              className={`absolute rounded-lg border-2 ${canDrop ? 'border-green-500' : 'border-red-500'} text-gray-50 px-2 h-7`}>

            </div>
          }

          <div id={'timeline'} className={`h-1 flex-1
           ${index % 3 == 0 && 'bg-orange-500'}
           ${index % 3 == 1 && 'bg-purple-500'}
           ${index % 3 == 2 && 'bg-pink-500'}
            my-auto`} style={{}}>

          </div>

          <div className="-mr-8 rounded-lg border-2 border-neutral-950 bg-black text-gray-50 px-2">
            E
          </div>
        </div>
      </div>
    </div>

  </div >
}

export { RouteItem }