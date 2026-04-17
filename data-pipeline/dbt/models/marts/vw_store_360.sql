-- 店舗総合ビュー (設計書 §2.1.2 vw_store_360)
-- Phase 1a でPOS接続後に本実装する。現状はプレースホルダ。

{{ config(materialized='view') }}

select
    cast(null as string)     as store_id,
    cast(null as string)     as store_name,
    cast(null as string)     as business_type,
    cast(null as date)       as as_of_date,
    cast(null as numeric)    as daily_sales,
    cast(null as numeric)    as daily_gross_profit,
    cast(null as int64)      as transaction_count,
    cast(null as int64)      as member_count,
    cast(null as numeric)    as inventory_aging_180d
where false
